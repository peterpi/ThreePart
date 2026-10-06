

export class Controller{

	#model

	constructor(model)
	{
		this.#model = model
	}

	async createView ()
	{
		await import ("../view/MainView.js")
		var view = document.createElement("bookings-main-view")
		view.setModel(this.#model)
		// TODO attach listeners to events raised by the view.
		return view
	}


}