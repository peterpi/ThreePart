


// TODO Decide and be consistent about whether the controller stores a reference to the model
// or whether the model is passed in to each "viewWhatever" method.
//
// In theory a controller could create views for many model instances.
// In practice that doesn't happen.
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

	async viewOffers ()
	{
		var c = await import ("./OffersEditorController.js")
			.then (mod => new mod.OffersEditorController())
		c.viewOffers(this.#model, this.#viewParent)
	}

	async viewStaffList(staffList)
	{
		var c = await import ("./StaffListController.js")
			.then (mod => new mod.StaffListController())
		c.viewStaff (staffList, this.#viewParent)
	}
}