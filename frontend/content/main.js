

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
		let staffListPromise = this.#model.getStaffList() // promise
		let viewPromise = import ("./view/StaffListView.js")
		this.#changePage (async () => {
			let staffList = await staffListPromise
			await viewPromise
			const view = document.createElement("staff-list-view")
			view.setup (staffList)
			return view
		})
	}

	#viewServices()
	{
		const model = this.#model
		let getServices = this.#model.getServices()
		this.#changePage(async () => {
			let services = await getServices
			await Promise.all ([
				import ("./view/ServiceListView.js"),
				import ("./view/OffersEditor.js")])
			const view = document.createElement("service-list-view")
			view.setup(services)
			const offers = document.createElement("offers-editor")
			await offers.setup(model)

			const div = document.createElement("div")
			div.appendChild(view)
			div.appendChild(offers)
			return div
		})
	}

}

customElements.define("bookings-mainmenu", MainView)