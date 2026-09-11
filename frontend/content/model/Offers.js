


class Offer extends EventTarget
{
	#price
	get price () {
		return this.#price
	}

	/** @type string */
	#uuid
	get uuid () {return this.#uuid}

	get baseUrl () {
		var s = `/api/offsers/${this.uuid}`
	}

	/** @type string */
	#name
	get name () {return this.#name}

	constructor (j) {
		super()
		this.#name = j.name
		this.#uuid = j.uuid
	}

	async addService (s)
	{
		if (!s)
			throw new Error ("Cannot add null service.")
		var url = `${this.baseUrl}/services`
		var resp = await fetch (url, {
			method:"POST",
			body:JSON.stringify({service:s.uuid}),
			headers:{"Content-Type":"application/json"}
		})
		if (!resp.ok)
			throw new Erorr ("Failed to add service to offer.")
		this.dispatchEvent(new CustomEvent ("service-added", {detail:{service:s}}))
	}

	async removeService (s)
	{
		if (!s)
			throw new Error ("Cannot remove null service.")
		var url = `${this.baseUrl}/services/${s.uuid}`
		var resp = await fetch (url, {
			method:"DELETE"
		})
		if (!resp.ok)
			throw new Error ("Failed to delete service from offer.")
		this.dispatchEvent(new CustomEvent("service-removed", {detail:{service:s}}))
	}
}


export class OfferList extends EventTarget
{

	/** @type Map<string,Offer>*/
	#offersByUuid

	constructor (j, serviceList)
	{
		super()
		var map = new Map()
		var offerObjs = j.offers.map (oj => new Offer (oj, serviceList))
		offerObjs.forEach (o => {
			var uuid = o.uuid
			map.set(uuid,o)
		})
		this.#offersByUuid = map
	}

	/** @param {ServiceList} serviceList */
	static async create(serviceList)
	{
		if (!serviceList)
			throw new Error ("Need serviceList")
		var j = await fetch ("/api/offers")
			.then (resp => resp.json())
		var me = new OfferList(j, serviceList)
		return me
	}

	async createOffer (j)
	{
		var url = `/api/offers`
		var resp = await fetch (url, {
			method:"POST",
			body:JSON.stringify(j),
			headers:{"Content-Type":"application/json"}
		})
		if (!resp.ok)
			throw new Error ("Failed to create offer.")
		var respJ = await resp.json()
		var o = new Offer(respJ)
		var uuid = o.uuid
		this.#offersByUuid.set (uuid,o)
		this.dispatchEvent(new CustomEvent ("offer-created", {detail:{offer:o}}))
	}

	forEach (cb)
	{
		var offerObjs = this.#offersByUuid.values()
		offerObjs.forEach(x => cb(x))
	}
}
