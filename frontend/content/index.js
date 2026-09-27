
import "./login.js"

var login = document.createElement("bookings-login")
document.body.appendChild(login)


login.addEventListener("logged-in", async _ => {
	console.log ("You're in.")
	login.remove();


	let model = await import ("./model/Model.js")
		.then (x => new x.Model())

	await import ("./main.js")
	let mainMenu = document.createElement("bookings-mainmenu")
	mainMenu.setup(model)
	document.body.appendChild(mainMenu)

})