

var template = await fetch ("main.html")
	.then (r => r.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))
	.then (doc => doc.querySelector("template"))


export class MainMenu
{
	view

	constructor ()
	{
		var view = document.createElement ("bookings-mainmenu")
		view.addEventListener("admin-requested", _ => {
			view.hidden = true
			import ("./admin.js").then(a => {
				var admin = new a.AdminMenu()
				document.body.appendChild(admin.view)
				admin.view.addEventListener("close-requested", _ => {
					admin.view.remove()
					view.hidden = false
				})
			})
		})
		this.view = view
	}
}


class MainView extends HTMLElement
{
	constructor()
	{
		super();
	}

	connectedCallback()
	{
		var shadow = this.attachShadow({mode:"closed"})
		var clone = template.content.cloneNode(true)
		shadow.appendChild(clone)

		var admin = shadow.querySelector("#admin")
		admin.addEventListener("click", _ => {
			this.dispatchEvent(new Event("admin-requested"))
		})
	}
}

customElements.define("bookings-mainmenu", MainView)