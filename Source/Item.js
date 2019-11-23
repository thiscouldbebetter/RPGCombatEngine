
function Item(defnName, quantity)
{
	this.defnName = defnName;
	this.quantity = (quantity == null ? 1 : quantity);
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
