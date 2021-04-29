
class EncounterDefn
{
	name: string;
	panes: Pane[];

	panesByName: Map<string, Pane>;

	constructor(name, panes)
	{
		this.name = name;
		this.panes = panes;

		this.panesByName = ArrayHelper.addLookupsByName(this.panes);
	}
}
