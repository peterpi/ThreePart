
export class ServiceListController
{


	async viewServiceList (serviceList, viewParent)
	{
		await import ("../view/ServiceListView.js")
		var view = document.createElement("service-list-view")
		view.setup(serviceList)
		viewParent.appendChild(view)
	}
}