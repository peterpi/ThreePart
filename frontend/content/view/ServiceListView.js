

var templates = await fetch (new URL ("ServiceListView.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


export class ServiceListView extends HTMLElement
{

	/** @type ServiceList */
	#serviceList

	/** @type HTMLElement */
	#rowParent

	/** @type Map<Service,HTMLElement> */
	#rowsByServiceUuid

	/** @type HTMLDivElement */
	#newBox

	#abort

	constructor()
	{
		super()
		this.#rowsByServiceUuid = new Map()
	}
	
	setServiceList(sl) {this.#serviceList = sl}

	async connectedCallback()
	{
		const serviceList = this.#serviceList
		if (!serviceList)
			throw new Error ("Must call setServiceList before connect.")

		this.#abort = new AbortController()

		var t = templates.getElementById("service-list-view")
		var clone = document.importNode(t.content, true)

		this.#rowParent = clone.querySelector("div.rowparent")
		if (!this.#rowParent)
			throw new Error ("Failed to find row parent in template.")

		var newBox = clone.getElementById("new")
		if (!newBox)
			throw new Error ("Failed to locate new box.")
		clone.getElementById("submit").addEventListener("click", _ => this.#requestNew(newBox))

		this.appendChild(clone)


		serviceList.addEventListener(
			"service-added",
			e => this.#addRow(e.detail.service),
			{signal:this.#abort.signal})
		serviceList.addEventListener(
			"service-deleted",
			e => this.#removeRowForService(e.detail.uuid),
			{signal:this.#abort.signal})

		const services = await serviceList.getAll()
		services.forEach(s => this.#addRow(s))
	}

	disconnectedCallback()
	{
		this.#abort.abort()
	}


	#addRow (service)
	{
		var rowTemplate = templates.getElementById("service-list-item")
		var clone = document.importNode(rowTemplate.content, true)

		var name = service.getName()
		var nameSpan = clone.querySelector("span.name")
		nameSpan.innerText = name
		
		clone.querySelector("button.del").addEventListener(
			"click",
			_ => this.dispatchEvent(new CustomEvent ("delete-requested", service)))

		this.#rowParent.appendChild(clone)
		var uuid = service.getUuid()
		this.#rowsByServiceUuid.set(uuid,clone)
	}


	#removeRowForService (uuid)
	{
		var rowsByService = this.#rowsByServiceUuid
		var row = rowsByService.get(uuid)
		if (!row)
			return
		rowsByService.delete(uuid)
		row.remove()
	}

	async #requestNew (newBox)
	{
		const name = newBox.querySelector("#name").value
		const fields = {name:name}
		this.dispatchEvent(new CustomEvent ("new-requested", {detail:{fields:fields}}))
	}
}


customElements.define("service-list-view", ServiceListView)