

export class AccountOrgMembership extends EventTarget
{

	#account

	constructor (account)
	{
		super()
		this.#account = account
	}

	async getOrgMemberships ()
	{
		var memberships = await fetch (`/api/accounts/${this.#account}/orgmemberships`)
			.then (resp => resp.json())
			.then (j => j.memberships)
		return memberships
	}

	async addMembership (orgId)
	{
		var url = `/api/accounts/${this.#account}/orgmemberships`
		var body = JSON.stringify({orgId:orgId})
		var newMembership = await fetch (url, {
			method:"POST",
			headers:{"Content-Type":"application/json"},
			body:body
		})
			.then (resp => resp.json())
		this.dispatchEvent(new CustomEvent ("added", {detail:{orgId:orgId}}))
	}
}