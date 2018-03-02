
function EncounterDefn(name, panes)
{
	this.name = name;
	this.panes = panes;

	this.panes.addLookups("name");
}
