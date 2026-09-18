



class StaffAvailabilityScheduleRow
{
	#dow
	get dow() {return this.#dow}

	#start
	get start() {return this.#start}

	constructor (j)
	{}

}

class StaffAvailabilitySchedule extends EventTarget
{

	/** @type Staff */
	#staff
	get staff() {return this.#staff}

	constructor(j)
	{
		super()
		let rows = []
		j.schedule.forEach (rowJson => {
			let row = new StaffAvailabilityScheduleRow(rowJson)
			rows.push(row)
		})
		this.#rows = rows
	}
}



export class StaffAvailabilityLibrary extends EventTarget
{

	/**
	 * 
	 * @param {Staff} staff 
	 */
	async getFor (staff)
	{
		let url = `/api/${staff.uuid}/availability`
		var j = await fetch (url).then (resp => resp.json())

	}

	/**
	 * 
	 * @param {Staff} staff 
	 */
	async getScheduleFor (staff)
	{
		let url = "/api/staff/${staff.uuid}/schedule"
		let j = await fetch (url).then (r => r.json())
	}
}

