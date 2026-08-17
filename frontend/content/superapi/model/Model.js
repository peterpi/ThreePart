

export class Model extends EventTarget
{

	#orgList


	async getOrgList()
	{
		var orgList = this.#orgList
		if (!orgList)
		{
			var module = await import ("./OrgList.js")
			orgList = this.#orgList = new module.OrgList()
		}
		return orgList
	}


}