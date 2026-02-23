
var templates = await fetch ("./services.html")
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))

class Service
{
	uuid
	name
	duration

	constructor (j)
	{
		this.uuid = j.uuid
		this.name = j.name
		this.duration = j.duration
	}
}

class ServiceEvent extends Event 
{
	s

	constructor (type, s, opts) {
		super(type, opts)
		this.s = s
	}
}

class ServiceEditEvent extends ServiceEvent
{
	details
	constructor (type, s, details, opts) {
		super (type, s, opts)
		this.details = details
	}
}

export class ServicesEditor extends EventTarget
{
	view

	constructor()
	{
		super()
		var view = document.createElement("bookings-serviceseditor")
		view.editor = this
		view.addEventListener("edit-requested", e => this.put(e.s, e.details))
		this.view = view
	}

	// Emits "got-service" for all services.
	async getAll ()
	{
		var response = await fetch ("/api/services")
			.then (r => r.json())
			.then (j => j.services.map (s => new Service(s)))
		for (var s of response) {
			var e = new CustomEvent ("got-service", {detail: s})
			this.dispatchEvent(e)
		}
	}

	// Alter an existing service.
	put (s, details)
	{
		var j = JSON.stringify(details)
		var url = `/api/services/${s.uuid}`
		var p = fetch (url, {
			method: "PUT",
			headers: {"Content-Type": "application/json"},
			body: j
		})
	}

	async createService (details)
	{
		var url = `/api/services`
		var s = await fetch (url, {
			method: "POST",
			headers: {"Content-Type" : "application/json"},
			body: JSON.stringify(details)
		})
		.then (resp => resp.json())
		.then (j => new Service (j))
		this.dispatchEvent(new CustomEvent ("got-service", {detail:s}))
		return s
	}
}


var serviceEditorTemplate = templates.querySelector("#service-editor")

// Individual Service
class ServiceEditorView extends HTMLElement
{
	s // The Service object

	constructor()
	{
		super()
	}

	connectedCallback() {
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild (serviceEditorTemplate.content.cloneNode(true))
		var nameInput = shadow.querySelector("#name")
		nameInput.value = this.s.name
		nameInput.addEventListener("change", _ => {
			this.dispatchEvent(
				new ServiceEditEvent (
					"edit-requested",
					this.s,
					{"name": nameInput.value},
					{bubbles: true, composed:true}), )
		})
	}

}

customElements.define("bookings-serviceeditor", ServiceEditorView)


class ServicesEditorNewServiceForm extends HTMLElement
{
	constructor()
	{
		super()
	}

	#name

	connectedCallback()
	{
		var template = templates.querySelector("#services-editor-new-service")
		var shadow = this.attachShadow({mode:"closed"})
		var clone = template.content.cloneNode(true)
		shadow.appendChild(clone)
		this.#name = shadow.querySelector("#name")
		var button = shadow.querySelector("button")
		button.addEventListener("click", e => this.#requestCreate())
	}

	clear()
	{
		this.#name.value = ""
	}

	#requestCreate()
	{
		var details = {
			name: this.#name.value
		}
		var e = new CustomEvent ("create-requested", {detail:details})
		this.dispatchEvent(e)
	}
}

customElements.define("bookings-serviceseditor-new-service", ServicesEditorNewServiceForm)

// Many services
class ServicesEditorView extends HTMLElement
{
	editor
	#shadow
	#create

	constructor ()
	{
		super()
	}

	async connectedCallback() {
		var template = templates.querySelector("#services-editor")
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(template.content.cloneNode(true))

		shadow.querySelector("#back").addEventListener("click", _ => {
			this.dispatchEvent(new Event ("back-requested"))
		})
		this.#shadow = shadow

		var create = shadow.querySelector("#create")
		create.addEventListener("create-requested", e => this.#createService(e.detail))
		this.#create = create

		this.editor.addEventListener("got-service", e => this.showService(e.detail))
		this.editor.getAll() // Will emit zero-or-more events of type "got-service".
		shadow.getElementById("loading").remove()
	}


	showService (details)
	{
		console.assert(details)
		var sv = document.createElement("bookings-serviceeditor")
		sv.s = details
		var rows = this.#shadow.querySelector("#rows")
		rows.appendChild(sv)
	}

	async #createService (details)
	{
		var create = this.#create
		create.setAttribute ("inert", true)
		try{
			await this.editor.createService (details) // Could fail, e.g. dupliate name
			create.clear()
		}
		finally {
			create.removeAttribute("inert")
		}
	}


}

customElements.define("bookings-serviceseditor", ServicesEditorView)