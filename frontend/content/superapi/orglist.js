"use strict"

var templates = await fetch ("orglist.html")
	.then (r => r.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))

// Model
export class OrgList extends EventTarget
{

	#orgs

	getOrgs() {return this.#orgs}

	constructor()
	{
		super()
		this.#orgs = [] // TODO Replace with mapping from id.
		this.refreshOrgs()
	}

	async refreshOrgs ()
	{
		var resp = await fetch ("api/orgs")
			.then (resp => resp.json())
		this.#orgs = resp.orgs
		this.dispatchEvent(new Event ("orgs-refreshed"))
		return resp.orgs
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



class OrgListView extends HTMLElement
{
	constructor() {
		super()
		this.#childrenById = new Map()
	}

	#orgList // The OrgList model instance.

	#rowParent // The parent element under which to place new instances. getElementById("rows")

	#childrenById

	setup (orglist)
	{
		this.#orgList = orglist
		orglist.addEventListener("org-added", e => this.#addNew(e.detail))
		orglist.addEventListener("org-deleted", e => this.#remove(e.detail))
		
	}

	async connectedCallback() {

		var clone = templates.getElementById("orglist").content.cloneNode(true)
		this.#rowParent = clone.getElementById("rows")
		clone.getElementById("newrow").addEventListener("new-requested", e => {
			this.dispatchEvent(new CustomEvent("new-requested", {detail: e.detail}))
		})
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(clone)
		this.#orgList.addEventListener ("orgs-refreshed", _ => this.#refresh())
	}

	#addNew (org)
	{
		var row = document.createElement("bookings-orglistrow")
		row.setup(org)
		this.#rowParent.appendChild(row)
		var id = org.id
		this.#childrenById.set (id, row)
		row.addEventListener("delete-requested", e => {
			this.dispatchEvent(new CustomEvent ("delete-requested", {detail: org}))
		})
	}

	#refresh()
	{
		var orgs = this.#orgList.getOrgs()
		for (var org of orgs)
			this.#addNew(org)
	}

	#remove (org)
	{
		var id = org.id
		var children = this.#childrenById
		var row = children.get(id)
		if (row == null)
			return
		children.delete(id)
		this.#rowParent.removeChild(row)
	}
}


customElements.define ("bookings-orglist", OrgListView)

class OrgListRow extends HTMLElement
{
	constructor(){super()}

	#org


	setup (j)
	{
		this.#org = j
	}


	connectedCallback()
	{
		var t = templates.getElementById("row")
		var clone = t.content.cloneNode(true)
		var del = clone.getElementById("delete")
		del.addEventListener("click", e => {
			this.dispatchEvent(new CustomEvent ("delete-requested"))
		})
		clone.getElementById("orgname").value = this.#org.orgname
		var shadow = this.attachShadow({mode:"open"})
		shadow.appendChild(clone)
	}

}

customElements.define("bookings-orglistrow", OrgListRow)


class OrgListNew extends HTMLElement
{
	constructor(){super()}

	connectedCallback()
	{
		var clone = templates.getElementById("newrow").content.cloneNode(true)
		var nameField = clone.getElementById("name")
		clone.getElementById("submit").addEventListener("click", _ => {
			var name = nameField.value
			this.dispatchEvent(new CustomEvent(
				"new-requested",
				{
					detail: {name: name}
				}
			))
		})
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(clone)
	}
}

customElements.define("bookings-orglist-newrow", OrgListNew)