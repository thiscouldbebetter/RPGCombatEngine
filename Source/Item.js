
function Item(defnName)
{
	this.defnName = defnName;
}

{
	Item.prototype.apply = function(agent, target)
	{
		this.defn().apply(this, agent, target);
	}

	Item.prototype.defn = function()
	{
		return Globals.Instance.universe.itemDefns[this.defnName];
	}
}
