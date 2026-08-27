"use strict"

export class Controller
{
	/** @type {Model} */
	#model

	/** @type {HTMLElement} */
	#viewParent

	constructor (model, viewParent)
	{
		if (!model)
			throw new Error ("No model")
		this.#model = model
		this.#viewParent = viewParent
	}

	async createView ()
	{
		var orgList = await this.#model.getOrgList()

		await import ("./view/OrgListView.js")
		var view = document.createElement ("bookings-orglist")
		view.setup(orgList)
		view.addEventListener("new-requested", e => orgList.addNew (e.detail))
		view.addEventListener("delete-requested", async e => {
			var id = e.detail.id
			await orgList.deleteOrg(id)
		})
		this.#viewParent.append(view)
		orgList.refreshOrgs()

		this.#showAccountList()
	}

	async #showAccountList ()
	{
		/** @type{AccountList} */
		var accountList = await this.#model.getAccountList()
		await import ("./view/AccountListView.js")
		var accountListView = document.createElement("tenant-admin-accountlist")
		accountListView.setup(accountList)
		accountListView.addEventListener("new-requested", e => accountList.registerNewUser(e.detail))
		accountListView.addEventListener("membership-view-requested", e => this.#showAccountMembershipView(e.detail.account))
		this.#viewParent.append(accountListView)
		accountList.getAll()
	}


	async #showAccountMembershipView (account)
	{
		await import ("./view/AccountOrgMembershipView.js")
		var view = document.createElement("tenant-admin-account-org-memberships")
		view.setup (this.#model, account)
		view.addEventListener("new-requested", async e => {
			var accountId = e.detail.accountId
			console.assert(accountId == account)
			var orgId = e.detail.orgId
			var membershipModel = await this.#model.getAccountMembershipModel(account)
			await membershipModel.addMembership(orgId)
		})
		view.addEventListener("back-requested", _ => view.remove())
		this.#viewParent.appendChild(view)
	}


}