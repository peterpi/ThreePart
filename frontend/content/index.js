
import "./login.js"

var login = document.createElement("bookings-login")
document.body.appendChild(login)


login.addEventListener("logged-in", _ => {
	console.log ("You're in.")
	login.remove();
	import ("./main.js")
		.then (m => {
			var main = new m.MainMenu()
			document.body.appendChild(main.view)
		})
	import ("./controller/Controller.js")
		.then (async m => {
			var model = await import ("./model/Model.js")
				.then (x => new x.Model())
			var ctrlr = new m.Controller(document.body, model)
			model.getServices()
				.then (services => {
					ctrlr.viewServiceList (services)
					ctrlr.viewOffers()
				})
		})
})