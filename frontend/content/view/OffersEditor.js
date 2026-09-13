
var templates = await fetch (new URL("OffersEditor.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


class OfferEditorServiceRow extends HTMLElement
{

	/**  @type Service */
	#service

	setup (service)
	{
		this.#service = service
	}

	connectedCallback()
	{
		var t = templates.getElementById("offer-editor-service-row")
		var clone = t.content.cloneNode(true)
		clone.querySelector(".serviceName").textContent = this.#service.name
		this.appendChild(clone)
	}
}

customElements.define("offer-editor-service-row", OfferEditorServiceRow)


class OfferEditor extends HTMLElement
{
	/** @type Offer */
	#offer

	/** @type HTMLElement */
	#rowsParent

	/** @type Map<string,HTMLElement> */
	#serviceRowsByService

	constructor()
	{
		super()
		this.#serviceRowsByService = new Map()
	}

	setup (offer)
	{
		console.assert(offer)
		this.#offer = offer
	}

	connectedCallback()
	{
		if (!this.#offer)
			throw new Error ("setup has not been called.")
		var t = templates.getElementById("offer-editor")
		var clone = t.content.cloneNode(true)

		// Service rows parent
		this.#rowsParent = clone.querySelector("section.services .rows-parent")
		console.assert(this.#rowsParent)

		// Name
		clone.querySelector("section.details input.name").value = this.#offer.name

		this.appendChild(clone)

		// Populate using existing offer data
		var currentServices = this.#offer.services
		currentServices.forEach (s => this.#addRowForService(s))
	}

	#addRowForService (service)
	{
		if (!service)
			throw new Error (`Cannot add row for null service.`)
		var ele = document.createElement("offer-editor-service-row")
		ele.setup(service)
		this.#rowsParent.appendChild(ele)
		this.#serviceRowsByService.set (service, ele)
		var num = this.#offer.services.length
		this.querySelector("section.services p.count").textContent = `(${num} services)`
	}
}

customElements.define("offer-editor", OfferEditor)



class OffersEditor extends HTMLElement
{
	/** @type OfferList */
	#offers

	/** @type ServiceList */
	#serviceList
	get serviceList() {return this.#serviceList}

	/** @type HTMLElement */
	#rowsParent

	/** type Map<string,HTMLElement> */
	#rowsByUuid
	
	constructor ()
	{
		super()
		this.#rowsByUuid = new Map()
	}

	/** @param {Model} model */
	async setup (model)
	{
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
		var row = document.createElement("offer-editor")
		row.setup(offer)
		this.#rowsParent.appendChild(row)
		var uuid = offer.uuid
		this.#rowsByUuid.set (uuid, row)
	}


}

customElements.define("offers-editor", OffersEditor)