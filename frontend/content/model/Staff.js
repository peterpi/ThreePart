
class Staff extends EventTarget
{
	#uuid
	get uuid() {return this.#uuid}

	#name
	get name() {return this.#name}

	constructor (j)
	{
		this.#name = j.name
		this.#uuid = j.uuid
	}
}


export class StaffList extends EventTarget
{

	/** @type WeakMap<string,Staff> */
	#byUuid

	constructor()
	{
		super()
		this.#byUuid = new WeakMap()
	}

	async getAll()
	{
		const url = "/api/staff"
		const j = await fetch(url).then(resp => resp.json())
		let all = []
		j.staff.forEach (x => {
			const s = new Staff(j)
			this.#byUuid.set (s.uuid, s)
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
}