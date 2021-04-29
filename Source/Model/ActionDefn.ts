
class ActionDefn
{
	name: string;
	requiresTarget: boolean;
	perform: any;
	toMenu: any;

	constructor
	(
		name: string, requiresTarget: boolean, perform: any, toMenu: any
	)
	{
		this.name = name;
		this.requiresTarget = requiresTarget;
		this.perform = perform;
		this.toMenu = toMenu;
	}
}
