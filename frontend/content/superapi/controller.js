"use strict"

import "./model.js"

export class Controller
{
	#model

	construtor (model)
	{
		this.#model = model
	}

	async createView (model, viewParent)
	{
		var orgList = await model.getOrgList()
		await import ("./orglist.js")
		var view = document.createElement ("bookings-orglist")
		view.setup(orgList)


		view.addEventListener("new-requested", e => orgList.addNew (e.detail))

		view.addEventListener("delete-requested", async e => {
			var id = e.detail.id
			await orgList.deleteOrg(id)
		})

		viewParent.append(view)
	}

}