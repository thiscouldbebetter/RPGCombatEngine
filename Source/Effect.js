
function Effect(defnName)
{
	this.defnName = defnName;
	this.turnApplied = turnApplied;
}

{
	Effect.prototype.defn = function()
	{
		return Globals.Instance.universe.effectDefns[this.defnName];
	}
}
