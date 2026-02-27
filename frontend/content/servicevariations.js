import ("./services.js")

var templates = await fetch ("./servicevariations.html")
	.then (resp => resp.text())
	.then (text => new DOMParser().parseFromString(text, "text/html"))


export class ServiceVariationsEditor extends HTMLElement
{
	#shadow

	constructor()
	{
		super()
	}

	async connectedCallback()
	{
		// TODO Show "loading"
		var uuid = this.getAttribute("uuid")
		var url = `/api/services/${uuid}`;
		service = await fetch (url)
			.then (resp => resp.json())
			.then (j => new Service (s))
		var t = templates.getElementById ("editor")
		var shadow = this.attachShadow ({mode:"closed"})
		shadow.appendChild(t.cloneNode(true))
		shadow.getElementById("serviceName").text = service.name

		// TODO What if we want to close while the fetch is in progress?
		// What if the fetch fails?
		shadow.getElementById("close").addEventListener("click", _ => {
			this.dispatchEvent(new CustomEvent("close-requested"))
		})
	}
}

customElements.define("service-variations-editor", ServiceVariationsEditor)