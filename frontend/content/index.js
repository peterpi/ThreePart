
import "./login.js"

var login = document.createElement("bookings-login")
document.body.appendChild(login)


login.addEventListener("logged-in", async _ => {
	console.log ("You're in.")
	login.remove();
	let main = await import ("./main.js")
	let mainMenu = new main.MainMenu()
	document.body.appendChild(mainMenu)
	let controllerModule = await import ("./controller/Controller.js")
	let modelModule = await import ("./model/Model.js")
	let model = new modelModule.Model()
	let controller = new controllerModule.Controller(document.body, model)
	let services = await model.getServices()
	controller.viewServiceList(services)
	controller.viewOffers(offers)
})