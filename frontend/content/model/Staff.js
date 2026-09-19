
class Staff extends EventTarget
{
	#uuid
	get uuid() {return this.#uuid}

	#name
	get name() {return this.#name}

	#email
	get email() {return this.#email}

	constructor (j)
	{
		super()
		this.#name = j.name
		this.#uuid = j.uuid
		this.#email = j.email
		if (!j.uuid)
			throw new Error ("No uuid.")
	}
}


export class StaffList extends EventTarget
{

	/** @type Map<string,Staff> */
	#byUuid

	constructor()
	{
		super()
		this.#byUuid = new Map()
	}

	async getAll()
	{
		const url = "/api/staff"
		const j = await fetch(url).then(resp => resp.json())
		let all = []
		j.staff.forEach (x => {
			const s = new Staff(x)
			var uuid = s.uuid
			this.#byUuid.set (uuid, s)
			all.push(s)
		})
		return all
	}

	async byUuid (u)
	{
		let s = this.#byUuid.get(u)
		if (s)
			return s
		const url = `/api/staff/${u}`
		const j = fetch (url).then(resp => resp.json())
		s = new Staff(j)
		this.#byUuid.set(s.uuid, s)
		return s
	}

	async postNew (args)
	{
		const url = "/api/staff"
		const j = await fetch (url, {
			method:"POST",
			body:JSON.stringify(args),
			headers:{"Content-Type":"application/json"}
		})
			.then (resp => resp.json())
		const s = new Staff(j)
		this.#byUuid.set(s.uuid, s)
		this.dispatchEvent(new CustomEvent ("new-staff", {detail:{staff:s}}))
		return s
	}
}