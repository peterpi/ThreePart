
import "./login.js"

var login = document.createElement("bookings-login")
document.body.appendChild(login)


login.addEventListener("logged-in", async _ => {
	console.log ("You're in.")
	login.remove();
	let main = await import ("./main.js")
	let mainMenu = new main.MainMenu()
	document.body.appendChild(mainMenu.view)

	let model = await import ("./model/Model.js")
		.then (x => new x.Model())
	let controller = await import ("./controller/Controller.js")
		.then(x => new x.Controller(document.body, model))

	const [services,staffList] = await Promise.all ([
		model.getServices(),
		model.getStaffList()
	])
	controller.viewStaffList(staffList)
	/*
	controller.viewServiceList(services)
	controller.viewOffers(offers)*/
})