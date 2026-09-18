

export class StaffListController extends EventTarget
{

	constructor ()
	{
		super()
	}

	async viewStaff (staffList, viewParent)
	{
		await import ("../view/StaffListView.js")
		const view = document.createElement("staff-list-view")
		view.setup (staffList)
		viewParent.appendChild(view)
	}
}

