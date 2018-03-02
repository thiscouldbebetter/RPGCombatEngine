
function Universe
(
	name, 
	imageLibrary,
	actionDefns,
	agentDefns, 
	effectDefns, 
	encounterDefns, 
	itemDefns,
	encounter
)
{
	this.name = name;
	this.imageLibrary = imageLibrary;
	this.actionDefns = actionDefns;
	this.agentDefns = agentDefns;
	this.effectDefns = effectDefns;
	this.encounterDefns = encounterDefns;
	this.itemDefns = itemDefns;
	this.encounter = encounter;

	this.agentDefns.addLookups("name");
	this.effectDefns.addLookups("name");
	this.encounterDefns.addLookups("name");
	this.itemDefns.addLookups("name");
}

{
	Universe.prototype.initialize = function()
	{
		this.encounter.initialize();
	}

	Universe.prototype.updateForTimerTick = function()
	{
		this.encounter.updateForTimerTick();
	}
}
