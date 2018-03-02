
function AgentDefn
(
	name, 
	visual,
	sizeInPixels, 
	integrityMax,
	energyMax,
	initiativeRange,
	actionDefns,
	spellDefns
)
{
	this.name = name;
	this.visual = visual;
	this.sizeInPixels = sizeInPixels;
	this.integrityMax = integrityMax;
	this.energyMax = energyMax;
	this.initiativeRange = initiativeRange;
	this.actionDefns = actionDefns;
	this.spellDefns = spellDefns;
	
	this.actionDefns.addLookups("name");

	if (this.spellDefns != null)
	{
		this.spellDefns.addLookups("name");
	}
}