

const templates = await fetch (new URL ("StaffListView.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))

class StaffListRow extends HTMLElement
{
	/** @type Staff */
	#s

	constructor()
	{
		super()
	}

	setup (s)
	{
		this.#s = s
	}

	connectedCallback()
	{
		const t = templates.getElementById("staff-list-row")
		const clone = t.content.cloneNode(true)
		clone.querySelector("input.name").value = this.#s.name
		clone.querySelector("button.schedule").addEventListener("click", e=> {
			this.dispatchEvent(new CustomEvent("schedule-requested"))
		})
		this.appendChild(clone)
	}
}

customElements.define("staff-list-row", StaffListRow)

class StaffListView extends HTMLElement
{
	#staffList

	#rowsParent

	/** @type AbortController */
	#abort

	constructor()
	{
		super()
		this.#abort = new AbortController()
	}

	async setup (staffList)
	{
		this.#staffList = staffList
	}

	async connectedCallback()
	{
		let staffList = this.#staffList
		staffList.addEventListener(
			"new-staff",
			e => this.#addRow(e.detail.staff),
			{signal: this.#abort.signal});


		const t = templates.getElementById("staff-list-view")
		var clone = t.content.cloneNode(true)
		this.#rowsParent = clone.querySelector("section.rows")

		const newSection = clone.querySelector("section.new")
		newSection.querySelector("button.submit").addEventListener("click", e => {
			this.#requestNew(newSection)
		})

		this.appendChild(clone)
		
		let all = await staffList.getAll()
		all.forEach(x => this.#addRow(x))
		this.querySelector("progress")?.remove()
	}

	disconnectedCallback()
	{
		this.#abort.abort()
	}



	#addRow (s)
	{
		var row = document.createElement("staff-list-row")
		row.setup(s)
		this.#rowsParent.appendChild(row)
		row.addEventListener("schedule-requested", e => {
			this.dispatchEvent(new CustomEvent (e.type, {detail:{staff:s}}))
		})
	}

	#requestNew (newSection)
	{
		const email = newSection.querySelector("input.email").value
		const name = newSection.querySelector("input.name").value
		const fields = {email:email,name:name}
		this.#staffList.postNew (fields)
	}
}

customElements.define ("staff-list-view", StaffListView)