

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
		parentNode.appendChild(view)
	}
}