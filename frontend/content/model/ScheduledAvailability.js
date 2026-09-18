
class ScheduledAvailability
{
	#id

	#dow
	get dow() {return this.#dow}

	constructor (j)
	{
		this.#dow = j.dow // TODO some magic to just convert "j" into an instance of ScheduledAvailabilty
	}
}