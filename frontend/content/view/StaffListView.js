

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

	#rowsParent

	constructor()
	{
		super()
	}

	connectedCallback()
	{
		const t = templates.getElementById("staff-list-view")
		var clone = t.content.cloneNode(true)
		this.#rowsParent = clone.querySelector("section.rows")

		const newSection = clone.querySelector("section.new")
		newSection.querySelector("button.submit").addEventListener("click", e => {
			this.#requestNew(newSection)
		})

		this.appendChild(clone)
	}

	async setup (staffList)
	{
		const all = await staffList.getAll()
		this.#rowsParent.querySelector("progress")?.remove()
		all.forEach (s => this.#addRow(s))
		staffList.addEventListener("new-staff", e => this.#addRow(e.detail.staff))
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
		this.dispatchEvent(new CustomEvent ("new-requested", {detail:{staff:fields}}))
	}
}

customElements.define ("staff-list-view", StaffListView)