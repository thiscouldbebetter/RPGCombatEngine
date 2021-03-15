
class Effect
{
	constructor(defnName)
	{
		this.defnName = defnName;
		this.turnApplied = turnApplied;
	}

	defn()
	{
		return Globals.Instance.universe.effectDefns[this.defnName];
	}
}
