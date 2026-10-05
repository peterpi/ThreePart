

self.addEventListener ("install", _ => {
	console.log ("install")
})


self.addEventListener("activate", _ => {
	console.log ("Activate.")
})

self.addEventListener("fetch", e => {
	let req = e.request
	console.log (`Fetching ${req.url} with ${req.method}.`)
})
