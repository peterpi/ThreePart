
var templates = await fetch (new URL("AccountOrgMembershipView.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


export class AccountOrgMembershipView extends HTMLElement
{
	
	#accountId

	/** @type {AccountOrgMembership} */
	#model

	/** @type {HTMLElement} */
	#rowParent

	setup (model, accountId)
	{
		this.#model = model
		this.#accountId = accountId
	}

	async connectedCallback ()
	{

		var model = this.#model;

		// Concurrently get the list of orgs (to populate the datalist)
		// as well as this account's org memberships.
		var refreshOrgs = model.getOrgList()
			.then (orgList => orgList.refreshOrgs())
		var getMemberships = model.getAccountMembershipModel(this.#accountId)
			.then (membershipModel => membershipModel.getOrgMemberships())
		var [orgs, memberships] = await Promise.all([refreshOrgs, getMemberships])


		var template = templates.getElementById("view")
		var content = template.content.cloneNode(true)
		this.#rowParent = content.getElementById("rows")
		memberships.forEach (m => {
			this.#addRow(m)
		} )

		var newBox = document.createElement("tenant-admin-account-org-memberships-new")
		await newBox.setup(model)
		content.getElementById("new").appendChild(newBox)

		newBox.addEventListener("new-requested", e => {
			var orgId = e.detail.orgId
			var accountId = this.#accountId
			var details = {orgId:orgId, accountId:accountId}
			this.dispatchEvent (new CustomEvent ("new-requested", {detail:details}))
		})

		content.getElementById("back").addEventListener(
			"click",
			e => this.dispatchEvent(new CustomEvent("back-requested")))

		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(content);
	}


	#addRow (membership)
	{
		if (!this.#rowParent)
			throw new Error ("rowParent has not been set.")
		var t = templates.getElementById("row")
		var clone = t.content.cloneNode(true)
		clone.getElementById("org").textContent = membership.orgname
		this.#rowParent.appendChild(clone)

	}
}

customElements.define ("tenant-admin-account-org-memberships", AccountOrgMembershipView)

class AccountOrgMembershipViewNew extends HTMLElement
{

	/** @type {OrgList} */
	#orgListModel

	/** @type {HTMLInputElement} */
	#orgName

	/** @type {Map<string,string>} */
	#orgIdByName

	constructor () {
		super()
		this.#orgIdByName = new Map()
	}

	async setup (model)
	{
		var orgList = await model.getOrgList()
		await orgList.refreshOrgsIfNotAlready()
		this.#orgListModel = orgList
		var orgs = orgList.getOrgs()
		orgs.forEach (o => this.#orgIdByName.set (o.orgname, o.id))
	}

	async connectedCallback()
	{
		var orgs = await this.#orgListModel.getOrgs()

		var t = templates.getElementById("new")
		var clone = t.content.cloneNode(true)
		this.#populateDataList(clone, "orgs", orgs)
		clone.getElementById("submit").addEventListener("click", _ => this.#onSubmit())
		this.#orgName = clone.getElementById("orgname")
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(clone)
	}

	#populateDataList (parent, listId, orgs)
	{
		var list = parent.getElementById(listId)
		if (!list)
			throw new Error (`Cannot find ${listId} under ${parent}`)
		orgs.forEach (o => {
			var opt = document.createElement("option")
			opt.setAttribute("value", o.orgname)
			list.appendChild(opt)
		})
	}

	#onSubmit()
	{
		var orgName = this.#orgName.value
		var orgId = this.#orgIdByName.get(orgName)
		if (!orgId)
			throw new Error (`Unkonwn org \"${orgName}\"`) // Or emit an event?
		this.dispatchEvent(new CustomEvent("new-requested", {detail:{orgId:orgId}}))
	}
}

customElements.define("tenant-admin-account-org-memberships-new", AccountOrgMembershipViewNew)
