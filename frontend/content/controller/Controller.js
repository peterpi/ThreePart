



export class Controller{

	/** @type HTMLElement */
	#viewParent

	#model

	constructor(viewParent, model)
	{
		this.#viewParent = viewParent
		this.#model = model
	}

	async create (viewParent)
	{
		var model = await import ("../model/Model.js")
			.then (modul => new modul.Model())
		var controller = new Controller (viewParent, model)
	}
	
	async viewServiceList (serviceList)
	{
		var c = await import ("./ServiceListController.js")
			.then (mod => new mod.ServiceListController())
		c.viewServiceList(serviceList, this.#viewParent)
	}
}