

var templates = await fetch ("bootstrap.html")
	.then (r => r.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


class Bootstrap extends HTMLElement
{
	constructor() {super()}


	async #showInstallation ()
	{
		var model = await import ("./model/Model.js").then (mod => new mod.Model())
		var controller = await import ("./controller.js").then (mod => new mod.Controller(model, this))
		controller.createView ()
	}

	async connectedCallback()
	{
		try
		{
			var resp = await fetch ("api/installation")
			if (!resp.ok)
				throw resp
			var j = await resp.json()
				.then (j => j.id)
			this.#showInstallation()
		}
		catch (err) {
			console.log ("Installation not found.")
			var create = document.createElement("bookings-createinstallation")
			this.appendChild(create)
			create.addEventListener("created-installation", _ => this.#showInstallation())
		}
	}

}


class CreateInstallation extends HTMLElement
{
	constructor(){super()}

	#email

	connectedCallback()
	{
		var t = templates.getElementById("createInstallation")
		var clone = t.content.cloneNode(true)
		clone.getElementById("submit").addEventListener("click", _ => this.#submit())
		var shadow = this.attachShadow({mode: "open"})
		shadow.appendChild(clone)
		this.#email = shadow.getElementById("email")
	}

	async #submit()
	{
		console.log ("Hello")
		var email = this.#email.value
		var req = {
			email:email
		}
		var id = await fetch ("api/installation",{
			method:"POST",
			body: JSON.stringify(req),
			headers:{
				"Content-Type" : "application/json"
			}
		})
		.then (resp => resp.json())
		.then (j => j.id)
		this.dispatchEvent(new CustomEvent("created-installation", {detail: id}))
	}
}

customElements.define("bookings-createinstallation", CreateInstallation)

customElements.define("bookings-bootstrap", Bootstrap)
