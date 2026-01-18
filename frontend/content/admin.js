


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

		shadow.querySelector("#services").addEventListener("click", _ => {
			this.dispatchEvent(new Event ("serviceseditor-requested"))
		})
	}
}


export class AdminMenu
{
	view
	
	constructor () {
		var view = document.createElement("bookings-admin")
		view.addEventListener("serviceseditor-requested", _ => {
			view.hidden = true
			import ("./services.js")
				.then (services => {
					var editor = new services.ServicesEditor()
					view.parentElement.appendChild (editor.view)
					editor.view.addEventListener("back-requested", _ => {
						editor.view.remove()
						view.hidden = false
					})
				})
		})

		this.view = view
	}

}

customElements.define("bookings-admin", AdminView)