

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
		view.addEventListener("new-requested", e => this.#createNew(staffList, e.detail))
		view.addEventListener("schedule-requested", e => this.#viewSchedule(e.detail.staff, viewParent))
	}

	#createNew (staffList, detail)
	{
		const args = detail.staff
		staffList.postNew (args)
	}

	async #viewSchedule (staff, viewParent)
	{
		await import ("../view/StaffAvailabilityEditor.js")
		const view = document.createElement("staff-availability-editor")
		view.setup(staff)
		viewParent.appendChild(view)
		view.addEventListener("back-requested", e => view.remove())
	}
}

