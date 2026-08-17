

var templates = await fetch ("bootstrap.html")
	.then (r => r.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


class Bootstrap extends HTMLElement
{
	constructor() {super()}

	async connectedCallback()
	{
		try
		{
			var installation 
			var resp = await fetch ("api/installation")
			if (!resp.ok)
				throw new Error ("No Installation"); // See catch below.
			var installation = (await resp.json()).installation
			console.log ("Got")
			if (!installation.id)
				throw installation // Catch it below

			this.dispatchEvent(new Event("InstallationDiscovered"))
			var controller = await import ("./controller.js").then (mod => new mod.Controller)
			var model = await import ("./model/Model.js").then (mod => new mod.Model())
			controller.createView (model, this)
		}
		catch (err) {
			console.log ("Oh dear: ")
			console.log (err)
			var create = document.createElement("bookings-createinstallation")
			this.appendChild(create)
			this.dispatchEvent(new Event("NoInstallation"))
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
		await fetch ("api/installation",{
			method:"POST",
			body: JSON.stringify(req),
			headers:{
				"Content-Type" : "application/json"
			}
		})
	}
}

customElements.define("bookings-createinstallation", CreateInstallation)

customElements.define("bookings-bootstrap", Bootstrap)
