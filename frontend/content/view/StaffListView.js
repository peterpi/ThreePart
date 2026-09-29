

const templates = await fetch (new URL ("StaffListView.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))

const Staff = await import ("../model/Staff.js")

class StaffListRow extends HTMLElement
{
	constructor()
	{
		super()
	}

	async connectedCallback()
	{
		const uuid = this.getAttribute("staff")
		const s = await Staff.staffList.byUuid(uuid)
		const t = templates.getElementById("staff-list-row")
		const clone = t.content.cloneNode(true)
		clone.querySelector("input.name").value = s.name
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

	/** @type AbortController */
	#abort

	constructor()
	{
		super()
		this.#abort = new AbortController()
	}


	async connectedCallback()
	{
		const staffList = Staff.staffList;
		
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
		this.#abort = new AbortController()
	}



	#addRow (s)
	{
		var row = document.createElement("staff-list-row")
		row.setAttribute("staff", s.uuid)
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
		Staff.staffList.postNew(fields)
	}
}

customElements.define ("staff-list-view", StaffListView)