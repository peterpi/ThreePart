

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
		this.appendChild(clone)
	}

	async setup (staffList)
	{
		const all = await staffList.getAll()
		this.#rowsParent.querySelector("progress")?.remove()
		all.forEach (s => this.#addRow(s))
	}

	#addRow (s)
	{
		var row = document.createElement("staff-list-row")
		row.setup(s)
		this.#rowsParent.appendChild(row)
	}
}

customElements.define ("staff-list-view", StaffListView)