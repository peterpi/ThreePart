
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
})