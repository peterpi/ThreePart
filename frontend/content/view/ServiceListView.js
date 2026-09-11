


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

	setup (model)
	{
		if (!model)
			throw new Error ("Need model parameter.")
		this.#rowsByServiceUuid = new Map()
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

		var newBox = clone.getElementById("new")
		if (!newBox)
			throw new Error ("Failed to locate new box.")
		clone.getElementById("submit").addEventListener("click", _ => this.#requestNew(newBox))

		var shadow = this.attachShadow({mode:"open"})
		shadow.appendChild(clone)

		var serviceList = this.#serviceList
		serviceList.addEventListener("service-added", e => this.#addRow(e.detail.service))
		serviceList.forEach (s => this.#addRow(s))
		serviceList.addEventListener("service-deleted", e => this.#removeRowForService(e.detail.uuid))
	}


	#addRowForEvent (evt) {
		this.#addRow(evt.detail)
	}

	#addRow (service)
	{
		var rowTemplate = templates.getElementById("service-list-row")
		var clone = document.importNode(rowTemplate.content, true)
		var tr = clone.querySelector("tr")
		var tdName = tr.querySelector ("td.name")
		var name = service.getName()
		tdName.innerText = name
		tr.querySelector("button.del").addEventListener("click", e => {
			this.dispatchEvent(new CustomEvent ("del-requested", {detail:{service:service}}))
		})
		this.#rowParent.appendChild(tr)
		var uuid = service.getUuid()
		this.#rowsByServiceUuid.set(uuid,tr)
	}

	/** @param {CustomEvent} removalEvent */
	#removeRowForService (uuid)
	{
		var rowsByService = this.#rowsByServiceUuid
		var row = rowsByService.get(uuid)
		if (!row)
			return
		rowsByService.delete(uuid)
		row.remove()
	}

	#requestNew (newBox)
	{
		var name = newBox.querySelector("#name").value
		this.dispatchEvent(new CustomEvent ("new-requested", {detail:{name:name}}))
	}
}


customElements.define("service-list-view", ServiceListView)