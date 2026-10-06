
export class ServiceListController
{

	async viewServiceList (viewParent)
	{
		var serviceList = await ("../model/Services.js").then (m => m.serviceList)
		await import ("../view/ServiceListView.js")
		var view = document.createElement("service-list-view")
		view.addEventListener ("new-requested", e => serviceList.postNew (e.detail.fields))
		view.addEventListener ("del-requested", e => serviceList.delete (e.detail.service))
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