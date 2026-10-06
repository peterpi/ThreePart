

var templates = await fetch (new URL("MainView.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


class MainView extends HTMLElement
{

	#model

	/** @type HTMLElement */
	#body

	/** @type HTMLElement */
	#inspector

	setModel (model) {
		this.#model = model
	}

	connectedCallback()
	{
		const clone = templates.getElementById("main").content.cloneNode(true)

		this.#body = clone.querySelector("div.main")
		this.#inspector = clone.querySelector("div.inspector")

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

	#setInspector (ele)
	{
		const i = this.#inspector
		while (i.firstChild)
			i.removeChild(i.firstChild)
		i.appendChild(ele)
	}


	#viewStaff ()
	{
		this.#changePage (async () => {
			const staffList = await this.#model.getStaffList()
			await import ("./StaffListView.js")
			const view = document.createElement("staff-list-view")
			view.setStaffList(staffList)
			view.addEventListener("inspecting-staff", e => this.#setInspector(e.detail.view))
			return view
		})
	}

	#viewServices()
	{
		this.#changePage(async () => {
			const serviceList = await this.#model.getServices()
			await import ("./ServiceListView.js")
			const view = document.createElement("service-list-view")
			view.setServiceList(serviceList)
			return view
		})
	}


}

customElements.define("bookings-main-view", MainView)