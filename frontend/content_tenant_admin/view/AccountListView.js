

var templates = await fetch (new URL("AccountListView.html", import.meta.url))
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


export class AccountListView extends HTMLElement
{

	/**@type {HTMLElement} */
	#rowsParent


	constructor()
	{
		super()
	}

	/**
	 * 
	 * @param {AccountList} model 
	 */
	setup (model)
	{
		model.addEventListener("account-added", e=>this.#addAccountView(e.detail))
	}

	connectedCallback ()
	{
		var content = templates.getElementById("account-list").content.cloneNode(true)
		this.#rowsParent = content.getElementById("rows")

		var newBox = content.getElementById("new")
		// TODO investigate event bubbling so that we don't need this line:
		// Maybe it doesn't traverse across shadow roots.
		if (false)
		newBox.addEventListener("new-requested", e => {
			this.dispatchEvent(new CustomEvent (e.type, {detail:e.detail}))
		})
		var shadow = this.attachShadow({mode: "closed"})
		shadow.appendChild(content)
	}

	/**
	 * 
	 * @param {Account} account 
	 */
	#addAccountView (account)
	{
		var acctId = account.id
		var row = document.createElement("tenant-admin-accountlist-row")
		row.setup (account)
		row.addEventListener("membership-view-requested", _ => {
			this.dispatchEvent(new CustomEvent ("membership-view-requested", {detail: {account: acctId}}))
		})
		this.#rowsParent.appendChild(row)
	}
}

customElements.define ("tenant-admin-accountlist", AccountListView)

class AccountListRow extends HTMLElement
{

	/** @type {Account}
	 *  @instance
	 */
	#account

	/**
	 * 
	 * @param {Account} account 
	 */
	setup (account)
	{
		this.#account = account
	}

	connectedCallback()
	{
		var clone = templates.getElementById("account-list-row").content.cloneNode(true)
		clone.getElementById("email").value = this.#account.email
		var membershipButton = clone.getElementById("memberships")
		membershipButton.addEventListener("click", _ => {
			this.dispatchEvent (new CustomEvent ("membership-view-requested"))
		})
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(clone)
	}
}

customElements.define("tenant-admin-accountlist-row", AccountListRow)


class AccountListViewNewBox extends HTMLElement
{

	connectedCallback()
	{
		var content = templates.getElementById("account-list-new").content.cloneNode(true)

		/** @type {HTMLInputElement} */
		var email = content.getElementById("email")
		var submit = content.getElementById("submit")
		submit.addEventListener("click", _ => {
			var j = {
				"email" : email.value
			};
			console.log(`new please: ${j.email}`)
			this.dispatchEvent(new CustomEvent ("new-requested", {bubbles: true, composed:true, detail:j}))
			});
		var shadow = this.attachShadow({mode:"closed"})
		shadow.appendChild(content)
	}
}

customElements.define("tenant-admin-accountlist-new", AccountListViewNewBox)