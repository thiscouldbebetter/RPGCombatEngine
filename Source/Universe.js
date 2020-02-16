
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

	this.agentDefns.addLookupsByName();
	this.effectDefns.addLookupsByName();
	this.encounterDefns.addLookupsByName();
	this.itemDefns.addLookupsByName();
}

{
	Universe.prototype.initialize = function()
	{
		this.encounter.initialize();
	};

	Universe.prototype.updateForTimerTick = function()
	{
		this.encounter.updateForTimerTick(this, null);
	};
}
