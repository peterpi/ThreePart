


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

	setup (model)
	{
		if (!model)
			throw new Error ("Need model parameter.")
		this.#rowsByServiceUuid = new Map()
		this.#serviceList = model
	}

	connectedCallback()
	{
		this.#abort = new AbortController()
		if (!this.#serviceList)
			throw new Error ("setup has not been called.")
		var t = templates.getElementById("service-list-view")
		var clone = document.importNode(t.content, true)

		this.#rowParent = clone.getElementById("rowparent")
		if (!this.#rowParent)
			throw new Error ("Failed to find row parent in template.")


		var newBox = clone.getElementById("new")
		if (!newBox)
			throw new Error ("Failed to locate new box.")
		clone.getElementById("submit").addEventListener("click", _ => this.#requestNew(newBox))

		var shadow = this.attachShadow({mode:"open"})
		shadow.appendChild(clone)

		var serviceList = this.#serviceList
		serviceList.addEventListener(
			"service-added",
			e => this.#addRow(e.detail.service),
			{signal:this.#abort.signal})
		serviceList.addEventListener(
			"service-deleted",
			e => this.#removeRowForService(e.detail.uuid),
			{signal:this.#abort.signal})
		serviceList.forEach (s => this.#addRow(s))
	}

	disconnectedCallback()
	{
		this.#abort.abort()
	}


	#addRow (service)
	{
		var rowTemplate = templates.getElementById("service-list-row")
		var clone = document.importNode(rowTemplate.content, true)
		var tr = clone.querySelector("tr")
		var tdName = tr.querySelector ("td.name")
		var name = service.getName()
		tdName.innerText = name
		tr.querySelector("button.del").addEventListener(
			"click",
			async e => this.#serviceList.delete(service))
		this.#rowParent.appendChild(tr)
		var uuid = service.getUuid()
		this.#rowsByServiceUuid.set(uuid,tr)
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
		await this.#serviceList.postNew(fields)
	}
}


customElements.define("service-list-view", ServiceListView)