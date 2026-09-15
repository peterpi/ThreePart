

export class OffersEditorController
{
	
	/**
	 * @type {Model} model
	 * @type {HTMLElement} parentNode
	 */
	async viewOffers (model, parentNode)
	{
		var offers = await model.getOffers()
		var services = await model.getServices()
		await import ("../view/OffersEditor.js")
		var view = document.createElement("offers-editor")
		await view.setup (model)
		view.addEventListener ("remove-requested", e => this.#performRemoval(e))
		parentNode.appendChild(view)
	}


	async #performRemoval (evt)
	{
		var offer = evt.detail.offer
		var service = evt.detail.service
		await offer.removeService(service)
	}

	async #performAddition (evt)
	{}
}