

var template = await fetch ("login.html")
	.then (r => r.text())
	.then (t => new DOMParser().parseFromString(t, "text/html"))
	.then (doc => doc.getElementById("login"))
template = document.adoptNode(template)


class Login extends HTMLElement
{

	constructor() {
		super()
	}

	#email
	#password

	connectedCallback() {
		var shadow = this.attachShadow ({mode:"closed"})
		var login = template.content.cloneNode(true)
		shadow.appendChild(login)

		this.#email = shadow.querySelector("#email")
		this.#password = shadow.querySelector("#pass")
		var submit = shadow.querySelector("#login")

		submit.addEventListener("click", this.#tryLogin);
		this.#tryLogin();
	}


	#tryLogin ()
	{
		var e = this.#email.value
		var p = this.#password.value
		var basic = btoa (e + ":" + p).toString()
		fetch ("/api/login", {
			method: "POST"
		})
		.then (r => {
			if (!r.ok)
				throw new Error();
			return r.json()
		})
		.then (j => this.dispatchEvent (new Event ("logged-in", j)))
	}
}

customElements.define("bookings-login", Login)