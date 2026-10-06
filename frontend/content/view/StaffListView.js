

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

	setStaff (s) {
		this.#s = s
	}

	async connectedCallback()
	{
		const t = templates.getElementById("staff-list-row")
		const clone = t.content.cloneNode(true)
		const s = this.#s
		clone.querySelector("div.name").textContent = s.name
		clone.querySelector("button.schedule").addEventListener("click", e=> {
			this.dispatchEvent(new CustomEvent("schedule-requested"))
		})
		this.appendChild(clone)
	}
}

customElements.define("staff-list-row", StaffListRow)

class StaffInspector extends HTMLElement
{

	#s

	setStaff (s) {this.#s = s}

	async connectedCallback()
	{
		const s = this.#s
		const t = templates.getElementById("staff-inspector")
		const clone = t.content.cloneNode(true)
		clone.querySelector("input.name").value = s.name
		this.appendChild(clone)
	}
}

customElements.define("staff-inspector", StaffInspector)

class StaffListView extends HTMLElement
{

	/** @type StaffList */
	#staffList

	#rowsParent

	#inspectorParent

	/** @type AbortController */
	#abort

	constructor()
	{
		super()
	}

	setStaffList (sl) {
		this.#staffList = sl
	}


	async connectedCallback()
	{
		this.#abort = new AbortController()
		const staffList = this.#staffList
		if (!staffList)
			throw new Error ("Call setStaffList before connecting.");
		
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

		this.#inspectorParent = clone.querySelector("div.side")

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
		row.setStaff(s)
		row.addEventListener("schedule-requested", e => {
			this.dispatchEvent(new CustomEvent (e.type, {detail:{staff:s}}))
		})
		row.addEventListener("click", e => this.#inspect(s))
		this.#rowsParent.appendChild(row)
	}

	#inspect (staff)
	{
		var inspector = document.createElement("staff-inspector")
		inspector.setStaff(staff)
		this.dispatchEvent(new CustomEvent ("inspecting-staff", {detail:{view:inspector}}))
	}

	#requestNew (newSection)
	{
		const email = newSection.querySelector("input.email").value
		const name = newSection.querySelector("input.name").value
		const fields = {email:email,name:name}
		this.dispatchEvent(new CustomEvent("new-requested", {detail:{staff:{fields}}}))
	}
}

customElements.define ("staff-list-view", StaffListView)