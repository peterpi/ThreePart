
var templates = await fetch (new URL ("StaffAvailabilityEditor.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))

await import ("../components/TimeRangePicker.js")

class StaffAvailabilityEditorRow extends HTMLElement
{
	/** @type HTMLSelectElement */
	#dow

	connectedCallback()
	{
		var t = templates.getElementById("staff-availability-editor-row")
		var clone = document.importNode(t.content) // .cloneNode(true)

		var dow = clone.querySelector ("select.dow")
		dow.addEventListener("change", e => this.#onChange())
		this.#dow = dow

		let del = clone.querySelector("button.del")
		del.addEventListener("click", e => this.dispatchEvent(new Event("del-requested")))

		this.appendChild(clone)
	}

	#onChange()
	{
		this.dispatchEvent(new CustomEvent ("changed"))
	}

	setup (a)
	{
		this.#dow.value = a.dow.toString()
	}
}

customElements.define("staff-availability-editor-row", StaffAvailabilityEditorRow)


class StaffAvailabilityEditor extends HTMLElement
{
	#staff

	constructor()
	{
		super()
	}

	setup (staff)
	{
		this.#staff = staff
	}

	connectedCallback()
	{
		var t = templates.getElementById("staff-availability-editor")
		var clone = t.content.cloneNode(true)
		clone.querySelector("button.back").addEventListener("click", _ => this.dispatchEvent(new Event("back-requested")))
		this.#setNameAndEmail(clone, this.#staff)
		this.appendChild(clone)
	}

	#setNameAndEmail (ele, staff)
	{
		ele.querySelector("span.staffname span.name").textContent = staff.name
		ele.querySelector("span.staffname span.email").textContent = staff.email
	}
}

customElements.define("staff-availability-editor", StaffAvailabilityEditor)