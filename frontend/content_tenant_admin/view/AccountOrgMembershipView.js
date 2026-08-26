
var templates = await fetch (new URL("AccountOrgMembershipView.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


export class AccountOrgMembershipView extends HTMLElement
{
	
	#account

	/** @type {AccountOrgMembership} */
	#model

	/** @type {HTMLElement} */
	#rowParent

	setup (model)
	{
		this.#model = model
	}

	async connectedCallback ()
	{
		var template = templates.getElementById("view")
		var content = template.content.cloneNode(true)
		this.#rowParent = content.getElementById("rows")

		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(content);

		var memberships = await this.#model.getOrgMemberships()
		memberships.forEach (m => this.#addRow(m))
	}

	#addRow (membership)
	{
		var t = templates.getElementById("row")
		var clone = t.content.cloneNode(true)
		clone.getElementById("org").textContent = membership.orgname
		this.#rowParent.appendChild(clone)

	}


}

customElements.define ("tenant-admin-account-org-memberships", AccountOrgMembershipView)