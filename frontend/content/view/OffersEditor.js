
var templates = await fetch (new URL("OffersEditor.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


class OffersEditor extends HTMLElement
{
	#i
	#offers
	#serviceList

	/** @type HTMLElement */
	#rowsParent

	/** type Map<string,HTMLElement> */
	#rowsByUuid
	
	constructor ()
	{
		super()
		this.#i = 1
		this.#rowsByUuid = new Map()
	}

	/** @param {Model} model */
	async setup (model)
	{
		this.#i = 2
		this.#serviceList = await model.getServices()
		this.#offers = await model.getOffers()
		if (!this.#offers)
			throw new Error ("Failed to get offers from model.")
	}

	connectedCallback()
	{
		if (!this.#offers)
			throw new Error ("setup has not been called.")
		var t = templates.getElementById("offers-editor")
		var clone = t.content.cloneNode(true)
		this.#rowsParent = clone.getElementById("rows-parent")
		this.appendChild(clone)


		var offers = this.#offers
		offers.forEach (o => this.#showNew(o))
		offers.addEventListener("offer-created", e => this.#showNew(e.detail.offer))
	}


	#showNew (offer)
	{
		var offerTemplate = templates.getElementById("offer-row2")
		var clone = offerTemplate.content.cloneNode(true) // TODO document.importNode instead?
		var name = clone.querySelector ("input.name")
		if (!name)
			throw new Error ("Cannot find name input.")
		name.value = offer.name
		clone.querySelector("section.name").textContent = offer.name
		var row = clone.firstElementChild
		this.#rowsParent.appendChild(row)
		var uuid = offer.uuid
		this.#rowsByUuid.set(uuid, row)
	}


}

customElements.define("offers-editor", OffersEditor)