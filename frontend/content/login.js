

var template = await fetch ("login.html")
	.then (r => r.text())
	.then (t => new DOMParser().parseFromString(t, "text/html"))
	.then (doc => doc.getElementById("login"))


class Login extends HTMLElement
{

	constructor() {
		super()
	}

	connectedCallback() {
		var shadow = this.attachShadow ({mode:"closed"})
		var login = template.content.cloneNode(true)

		var email = login.querySelector("#email")
		var passwd = login.querySelector("#pass")
		var submit = login.querySelector("#login")

		submit.addEventListener("click", e => {
			var e = email.value
			var p = passwd.value
			fetch ("/api/login", {
				method: "POST",
				headers: {
					"Authorization" : "Basic " + btoa (e + ":" + p).toString()
				}
			})
			.then (r => r.json())
			.then (j => this.dispatchEvent (new Event ("login")))
		})

		shadow.append(login)
	}
}

customElements.define("bookings-login", Login)