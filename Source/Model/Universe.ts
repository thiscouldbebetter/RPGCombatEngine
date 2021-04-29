
class Universe
{
	constructor
	(
		name: string, 
		imageLibrary: ImageLibrary,
		actionDefns: ActionDefn[],
		agentDefns: AgentDefn[], 
		effectDefns: EffectDefn[], 
		encounterDefns: EncounterDefn[], 
		itemDefns: ItemDefn[],
		encounter: Encounter
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

		this.agentDefnsByName = ArrayHelper.addLookupsByName(this.agentDefns);
		this.effectDefnsByName = ArrayHelper.addLookupsByName(this.effectDefns);
		this.encounterDefnsByName = ArrayHelper.addLookupsByName(this.encounterDefns);
		this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);
	}

	initialize(): void
	{
		this.encounter.initialize();
	}

	updateForTimerTick(): void
	{
		this.encounter.updateForTimerTick(this, null);
	}
}
