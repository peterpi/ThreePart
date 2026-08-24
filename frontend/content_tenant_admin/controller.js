"use strict"

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
		await import ("./view/OrgListView.js")
		var view = document.createElement ("bookings-orglist")
		view.setup(orgList)

		orgList.refreshOrgs()


		view.addEventListener("new-requested", e => orgList.addNew (e.detail))

		view.addEventListener("delete-requested", async e => {
			var id = e.detail.id
			await orgList.deleteOrg(id)
		})

		viewParent.append(view)

		/** @type{AccountList} */
		var accountList = await model.getAccountList()
		await import ("./view/AccountListView.js")
		var accountListView = document.createElement("tenant-admin-accountlist")
		accountListView.setup(accountList)
		viewParent.append(accountListView)
		accountListView.addEventListener("new-requested", e => accountList.registerNewUser(e.detail))
		accountList.getAll()
	}

}