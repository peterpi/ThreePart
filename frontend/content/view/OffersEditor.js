
var templates = await fetch (new URL("OffersEditor.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


class OfferEditorAddService extends HTMLElement
{
	#serviceList

	setup (serviceList)
	{
		if (!serviceList)
			throw new Error ("Must provide ServiceList.")
		this.#serviceList = serviceList

		var select = this.querySelector("select.service")
		serviceList.forEach(s => {
			var serviceName = s.name
			var serviceUuid = s.uuid
			var opt = document.createElement("option")
			opt.setAttribute("value", serviceUuid)
			opt.textContent = serviceName
			select.appendChild(opt)
		})
	}

	connectedCallback()
	{
		var t = templates.getElementById("offer-editor-add-service")
		var clone = t.content.cloneNode(true)
		clone.querySelector("button").addEventListener("click", e => this.#collectAndEmit())
		this.appendChild(clone)
	}

	#collectAndEmit()
	{
		var uuid = this.querySelector("select.service").value
		var service = this.#serviceList.getByUuid(uuid)
		console.assert(service)
		if (!service)
			return
		this.dispatchEvent(
			new CustomEvent(
				"addition-requested", {
					detail:{service:service},
					bubbles:true
				}))
	}
}

customElements.define("offer-editor-add-service", OfferEditorAddService)

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
		clone.querySelector ("button.del").addEventListener("click", e => {
			this.dispatchEvent(new CustomEvent ("remove-requested"))
		})
		this.appendChild(clone)
	}
}

customElements.define("offer-editor-service-row", OfferEditorServiceRow)


class OfferEditor extends HTMLElement
{
	/** @type Offer */
	#offer

	/** @type ServiceList */
	#serviceList

	/** @type HTMLElement */
	#rowsParent

	/** @type Map<string,HTMLElement> */
	#serviceRowsByService

	constructor()
	{
		super()
		this.#serviceRowsByService = new Map()
	}

	setup (offer, serviceList)
	{
		console.assert(offer)
		this.#offer = offer
		console.assert(serviceList)
		this.#serviceList = serviceList
		offer.addEventListener("service-added", e => this.#addRowForService(e.detail.service))
		offer.addEventListener("service-removed", e => this.#removeRowForService(e.detail.service))
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

		// Set up the add-service box
		var addSrv = this.querySelector("offer-editor-add-service")
		addSrv.setup (this.#serviceList)
	}

	#addRowForService (service)
	{
		if (!service)
			throw new Error (`Cannot add row for null service.`)
		var ele = document.createElement("offer-editor-service-row")
		ele.setup(service)
		ele.addEventListener("remove-requested", e => {
			this.dispatchEvent(new CustomEvent ("remove-requested", {detail:{service:service}}))
		})
		this.#rowsParent.appendChild(ele)
		this.#serviceRowsByService.set (service, ele)
		this.#recalculateNum()
	}

	#removeRowForService (service)
	{
		var rows = this.#serviceRowsByService
		var ele = rows.get(service)
		if (!ele)
			return
		rows.delete(service)
		ele.remove()
		this.#recalculateNum()
	}

	#recalculateNum ()
	{
		var num = this.#offer.services.length
		var s = `(${num} services)`
		this.querySelector("section.services p.count").textContent = s
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
		row.setup(offer, this.#serviceList)
		row.addEventListener("remove-requested", e => {
			this.dispatchEvent(new CustomEvent ("remove-requested", {detail:{
				offer:offer,
				service:e.detail.service
			}}))
		})
		row.addEventListener("addition-requested", e => {
			e.stopPropagation()
			var service = e.detail.service
			this.dispatchEvent(new CustomEvent(e.type, {
				detail: {offer:offer, service:service}}))
		})
		this.#rowsParent.appendChild(row)
		var uuid = offer.uuid
		this.#rowsByUuid.set (uuid, row)
	}


}

customElements.define("offers-editor", OffersEditor)