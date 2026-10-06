
import "./login.js"

var login = document.createElement("bookings-login")
document.body.appendChild(login)

navigator.serviceWorker.register ("./sw.js")

login.addEventListener("logged-in", async _ => {
	console.log ("You're in.")
	login.remove();

	const model = await import ("./model/Model.js")
		.then (x => new x.Model())
	const controller = await import ("./controller/Controller.js")
		.then (x => new x.Controller(model))
	const view = await controller.createView()
	document.body.appendChild(view)
})