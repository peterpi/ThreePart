
export class Model
{

	async getServices()
	{
		var sl = await import ("./Services.js")
			.then (mod => mod.ServiceList.getAll())
		return sl
	}
}
