


class AdminView extends HTMLElement
{
	constructor() {
		super()
	}

	menu

	async connectedCallback ()
	{
		var template = await fetch ("admin.html")
			.then (r => r.text())
			.then (text => new DOMParser().parseFromString(text, "text/html"))
			.then (doc => doc.querySelector("template"))

		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(template.content.cloneNode(true))

		shadow.querySelector("#back").addEventListener("click", _ => {
			this.dispatchEvent(new Event("close-requested"))
		})
	}
}


export class AdminMenu
{
	view
	
	constructor () {
		this.view = document.createElement("bookings-admin")
	}

}

customElements.define("bookings-admin", AdminView)