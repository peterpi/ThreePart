
export class Model extends EventTarget
{

	#orgList


	async getOrgList()
	{
		var orgList = this.#orgList
		if (!orgList)
		{
			var module = await import ("./OrgList.js")
			orgList = this.#orgList = new module.OrgList()
		}
		return orgList
	}

	/** @type {AccountList} */
	#accountList

	async getAccountList()
	{
		if (!this.#accountList)
			this.#accountList = await import ("./AccountList.js").then (mod => new mod.AccountList())
		return this.#accountList
	}

	async getAccountMembershipModel (account)
	{
		if (!account)
			throw new Error ("No account given.")
		var mod = await import ("./AccountOrgMembership.js")
		var model = new mod.AccountOrgMembership(account)
		return model
	}

}