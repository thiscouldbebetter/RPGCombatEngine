
class ItemDefn
{
	name: string;
	categoryNames: string[];
	apply: any;

	constructor(name: string, categoryNames: string[], apply: any)
	{
		this.name = name;
		this.categoryNames = categoryNames;
		this.apply = apply;
	}
}
