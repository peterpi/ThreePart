

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
}