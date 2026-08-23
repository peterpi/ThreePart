

// Model
export class OrgList extends EventTarget
{

	#orgs

	// Get the currently-known orgs, WITHOUT a round-trip to the server.
	getOrgs() {return this.#orgs}

	constructor()
	{
		super()
		this.#orgs = [] // TODO Replace with mapping from id.
	}

	// Query the API for the list of orgs and emit an "orgs-refreshed" event at the end.
	async refreshOrgs ()
	{
		var resp = await fetch ("api/orgs")
			.then (resp => resp.json())
		this.#orgs = resp.orgs
		this.dispatchEvent(new Event ("orgs-refreshed"))
	}

	async addNew (args)
	{
		var newOrg = await fetch (
			"api/orgs",
			{
				method: "POST",
				body: JSON.stringify(args),
				headers: {
					"Content-Type" : "application/json"
				}
			}
		).then (resp => resp.json())
		this.#orgs.push (newOrg)
		this.dispatchEvent(new CustomEvent ("org-added", {detail: newOrg}))
	}

	async deleteOrg (orgId)
	{
		var resp = await fetch (
			`api/orgs/${orgId}`,
			{
				method: "DELETE"
			}
		)
		if (!resp.ok)
			throw new Error (resp)
		var orgs = this.#orgs
		var idx = orgs.findIndex (x => x.id == orgId)
		var found = idx >= 0
		if (!found)
			return
		var deletedOrg = orgs[idx]
		orgs.splice(idx, 1)
		this.dispatchEvent(new CustomEvent ("org-deleted", {detail: deletedOrg}))
	}
}


