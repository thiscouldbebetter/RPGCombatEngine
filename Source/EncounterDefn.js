
class EncounterDefn
{
	constructor(name, panes)
	{
		this.name = name;
		this.panes = panes;

		this.panes.addLookupsByName();
	}
}
