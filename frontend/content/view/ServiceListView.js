


var templates = await fetch (new URL ("ServiceListView.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


class ServiceListRow extends EventTarget
{

	constructor (ele)
	{
		super()

	}
	/** @type Service */
	#service

	setup (service) {this.#service = service}

	connectedCallback()
	{
		var name = document.createElement("td")
		name.textContent = this.#service.getName()
		this.appendChild(name)
	}
}


export class ServiceListView extends HTMLElement
{

	/** @type ServiceList */
	#serviceList

	/** @type HTMLElement */
	#rowParent

	/** @type Map<Service,ServiceListRow> */
	#rowsByService

	setup (model)
	{
		if (!model)
			throw new Error ("Need model parameter.")
		this.#rowsByService = new Map()
		this.#serviceList = model
	}

	connectedCallback()
	{
		var t = templates.getElementById("service-list-view")
		var clone = document.importNode(t.content, true)

		this.#rowParent = clone.getElementById("rowparent")
		if (!this.#rowParent)
			throw new Error ("Failed to find row parent in template.")

		var back = clone.getElementById("back")
		back.addEventListener("click", _ => {
			this.remove()
		})

		var shadow = this.attachShadow({mode:"open"})
		shadow.appendChild(clone)

		this.#serviceList.addEventListener("service-added", this.#addRow)
		this.#serviceList.forEach (s => this.#addRow(s))


	}

	disconnectedCallback()
	{
		this.#serviceList.addEventListener("service-added", this.#addRow)
	}

	#addRow (service)
	{
		var t = templates.getElementById("service-list-row")
		var clone = document.importNode(t.content, true)
		var tdName = clone.querySelector ("td.name")
		var name = service.getName()
		tdName.innerText = name
		this.#rowParent.appendChild(clone)
		this.#rowsByService.set(service,clone)
	}
}


customElements.define("service-list-view", ServiceListView)