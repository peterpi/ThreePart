
export class Model
{

	#staffList

	async getStaffList()
	{
		let staff = this.#staffList
		if (!staff) {
			staff = await import ("./Staff.js")
				.then (x => new x.StaffList())
			this.#staffList = staff
		}
		return staff
	}

	/** @type ServiceList */
	#serviceList

	async getServices()
	{
		var sl = this.#serviceList
		if (!sl) {
			sl = await import ("./Services.js")
				.then (mod => mod.ServiceList.getAll())
			this.#serviceList = sl
		}
		return sl
	}

	/** @type {Offers} */
	#offers

	async getOffers()
	{
		var services = await this.getServices()
		var o = this.#offers
		if (!o) {
			o = await import ("./Offers.js")
				.then (mod => mod.OfferList.create(services))
			this.#offers = o
		}
		return o
	}

}
