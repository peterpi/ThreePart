
var templates = await fetch ("./services.html")
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))

class Service
{
	name
	duration

	constructor (j)
	{
		this.name = j.name
		this.duration = j.duration
	}
}

export class ServicesEditor
{
	view

	constructor()
	{
		this.view = document.createElement("bookings-serviceseditor")
		this.view.editor = this
	}

	getAll () // Returns a promise to an array of Service objects.
	{
		var servicesPromise = fetch ("/api/services")
			.then (r => r.json())
			.then (j => j.services.map (s => new Service(s)))
		return servicesPromise
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
		shadow.querySelector("#name").value = this.s.name
	}

}

customElements.define("bookings-serviceeditor", ServiceEditorView)


// Many services
class ServicesEditorView extends HTMLElement
{
	editor

	constructor ()
	{
		super()
	}

	connectedCallback() {
		var template = templates.querySelector("#services-editor")
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(template.content.cloneNode(true))

		shadow.querySelector("#back").addEventListener("click", _ => {
			this.dispatchEvent(new Event ("back-requested"))
		})

		var rows = shadow.querySelector("#rows")
		this.editor.getAll()
			.then (services => {
				services.forEach(s => {
					var sv = document.createElement("bookings-serviceeditor")
					sv.s = s
					rows.appendChild(sv)
				});
			})

	}


}

customElements.define("bookings-serviceseditor", ServicesEditorView)