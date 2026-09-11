

class Service extends EventTarget
{
	#uuid
	#name

	constructor(j) {
		super()
		this.#uuid = j.uuid
		this.#name = j.name
	}

	#getBaseUrl() {
		return `/api/services/${this.#uuid}`
	}

	getName() {
		return this.#name
	}

	setName (value)
	{
		var url = this.#getBaseUrl()
		var promise = fetch (url, {
			method: "PATCH",
			body: JSON.stringify ({name: value}),
			headers:{"Content-Type":"application/json"}
		})
			.then (resp => resp.json())
			.then (j => null)
		return promise
	}

	getUuid()
	{
		return this.#uuid
	}
};


export class ServiceList extends EventTarget
{

	/** @type Map<uuid,Service> */
	#services

	constructor (j)
	{
		if (!j || !j.services)
			throw new Error ("Parameter must be a json response.")
		super()
		this.#services = new Map()
		j.services.forEach (x => {
			var service = new Service(x)
			var uuid = service.getUuid()
			this.#services.set(uuid,service)
		})
	}

	static #parse(j)
	{
		var services = j.services
		services = services.map (s => Service.parse(s))
	}

	static async getAll()
	{
		var url = "/api/services"
		var serviceList = fetch (url)
			.then (resp => resp.json())
			.then (j => new ServiceList(j))
		return serviceList
	}

	async postNew (details)
	{
		if (!details)
			throw new Error ("No details given.")
		var url = "/api/services"
		var j = await fetch (url, {
			method:"POST",
			body:JSON.stringify(details),
			headers:{"Content-Type":"application/json"}
		})
			.then (resp => resp.json())
		var service = new Service(j)
		this.#services.set (service.getUuid(), service)
		this.dispatchEvent(new CustomEvent ("service-added", {detail:{service:service}}))
	}

	async delete (service)
	{
		if (!service)
			throw new Error ("Cannot delete null service.")
		var uuid = service.getUuid()
		var url = `/api/services/${uuid}`
		var resp = await fetch (url, {
			method:"DELETE"
		})
		if (!resp.ok)
			throw new Error ("Service deletion failed.")
		this.#services.delete(uuid) // Don't care if it was ever present.
		this.dispatchEvent(new CustomEvent ("service-deleted", {detail:{uuid:uuid}}))
	}

	forEach (cb)
	{
		var services = this.#services.values()
		services.forEach(s => cb(s))
	}

	
}