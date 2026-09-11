
export class ServiceListController
{

	async viewServiceList (serviceList, viewParent)
	{
		await import ("../view/ServiceListView.js")
		var view = document.createElement("service-list-view")
		view.setup(serviceList)
		view.addEventListener ("new-requested", e => this.#createNew(serviceList, e))
		viewParent.appendChild(view)
	}

	/**
	 * @param {ServiceList} serviceList
	 * @param {CustomEvent} evt
	 * */
	async #createNew (serviceList, evt)
	{
		var details = evt.detail
		var s = await serviceList.postNew (details)
	}
}