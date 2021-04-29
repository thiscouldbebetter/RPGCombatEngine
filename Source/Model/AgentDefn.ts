
class AgentDefn
{
	name: string;
	visual: Visual;
	sizeInPixels: Coords,
	integrityMax: number;
	energyMax: number;
	initiativeRange: Range2;
	actionDefns: ActionDefn[];
	spellDefns: SpellDefn[];

	actionDefnsByName: Map<string, ActionDefn>;
	spellDefnsByName: Map<string, SpellDefn>;

	constructor
	(
		name: string, visual: Visual, sizeInPixels: Coords,
		integrityMax: number, energyMax: number,
		initiativeRange: Range2, actionDefns: ActionDefn[],
		spellDefns: SpellDefn[]
	)
	{
		this.name = name;
		this.visual = visual;
		this.sizeInPixels = sizeInPixels;
		this.integrityMax = integrityMax;
		this.energyMax = energyMax;
		this.initiativeRange = initiativeRange;
		this.actionDefns = actionDefns;
		this.spellDefns = spellDefns || [];

		this.actionDefnsByName = ArrayHelper.addLookupsByName(this.actionDefns);

		this.spellDefnsByName = ArrayHelper.addLookupsByName(this.spellDefns);
	}
}
