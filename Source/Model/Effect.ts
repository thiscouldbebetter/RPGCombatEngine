
class Effect
{
	defnName: string;
	turnApplied: number;

	constructor(defnName: string, turnApplied: number)
	{
		this.defnName = defnName;
		this.turnApplied = turnApplied;
	}

	defn()
	{
		return Globals.Instance.universe.effectDefnsByName.get(this.defnName);
	}
}
