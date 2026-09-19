
const templates = await fetch (new URL ("TimeRangePicker.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))



function temporalFromInput (inputElement)
{
	const str = inputElement.value
	const t = Temporal.PlainTime.from(str)
	return t
}

class TimeRangePicker extends HTMLElement
{

	#start
	#end
	#notes
	#durationText

	get start () {return temporalFromInput(this.#start)}
	get end() {return temporalFromInput(this.#end)}
	// TODO setters that also set the input elements.

	get wraps () {
		const s = this.start
		const e = this.end
		const wraps = Temporal.PlainTime.compare(e, s) < 0
		return wraps
	}

	get duration() {
		const s = this.start
		const e = this.end
		let duration = e.since(s)
		if (duration.sign < 0)
			duration = duration.add (Temporal.Duration.from ({days:1}))
		return duration
	}

	constructor()
	{
		super()
	}

	connectedCallback ()
	{
		console.log ("Hello")
		var t = templates.getElementById("time-range-picker")
		var clone = t.content.cloneNode(true)

		// Start
		const s = clone.getElementById("start")
		this.#start = s
		s.addEventListener("change", e => this.#checkRange())

		// End
		const e = clone.getElementById("end")
		e.addEventListener("change", e => this.#checkRange())
		this.#end = e

		this.#notes = clone.getElementById("notes")
		this.#durationText = clone.getElementById("duration")
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(clone)
	}

	#checkRange ()
	{
		if (this.wraps)
			this.#notes.textContent = "(next day)"
		const dur = this.duration
		this.#durationText.textContent = dur.toLocaleString()
	}
}

customElements.define("time-range-picker", TimeRangePicker)
