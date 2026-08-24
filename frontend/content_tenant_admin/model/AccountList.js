

export class Account extends EventTarget
{
	email
}


export class AccountList extends EventTarget
{

	async getAll()
	{
		/** @type {Account[]} */
		var accounts = await fetch ("api/accounts")
			.then (resp => resp.json())
			.then (j => j.accounts)

		accounts.forEach (a => {
			this.dispatchEvent(new CustomEvent ("account-added", {detail:a}))
		})
	}

	/** @param {{email: string}} userObj */
	async registerNewUser(userObj)
	{
		console.log (`Registering ${userObj.email}`)
		var newUser = await fetch ("api/accounts", {
			method: "POST",
			body: JSON.stringify(userObj),
			headers: {"Content-Type": "application/json"}
		})
			.then (resp => resp.json())
		this.dispatchEvent(new CustomEvent ("account-added", {detail: newUser}))
	}
}