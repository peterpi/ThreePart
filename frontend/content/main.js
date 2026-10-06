

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

	#model

	#body

	setup (model)
	{
		this.#model = model
	}

	connectedCallback()
	{
		var clone = template.content.cloneNode(true)
		this.#body = clone.querySelector(".main")

		let sidebar = clone.querySelector(".sidebar")
		sidebar.querySelector("button.staff").addEventListener("click", _ => this.#viewStaff())
		sidebar.querySelector("button.services").addEventListener("click", _ => this.#viewServices())
		this.appendChild(clone)
	}

	async #changePage (asyncPageGenerator)
	{
		let parent = this.#body
		while (parent.firstChild)
			parent.removeChild(parent.firstChild)
		let progress = document.createElement("progress")
		parent.appendChild(progress)
		let newPage = await asyncPageGenerator()
		progress.remove()
		parent.appendChild(newPage)
	}


	#viewStaff ()
	{
		this.#changePage (async () => {
			await import ("./view/StaffListView.js")
			const view = document.createElement("staff-list-view")
			return view
		})
	}

	#viewServices()
	{
		this.#changePage(async () => {
			await import ("./view/ServiceListView.js")
			const view = document.createElement("service-list-view")
			return view
		})
	}


	#viewSchedules()
	{
		this.#changePage(async () => {
			await import ("./view/StaffAvailabilityEditor.js")
			let view = document.createElement("staff-availability-editor")
			return view
		})
	}

}

customElements.define("bookings-mainmenu", MainView)