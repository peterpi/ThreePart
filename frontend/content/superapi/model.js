"use strict"

export class Model extends EventTarget
{

	#orgList


	async getOrgList()
	{
		var orgList = this.#orgList
		if (!orgList)
		{
			var module = await import ("./orglist.js")
			orgList = this.#orgList = new module.OrgList()
		}
		return orgList
	}
	


}