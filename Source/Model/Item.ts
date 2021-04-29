
class Item
{
	defnName: string;
	quantity: number;

	constructor(defnName: string, quantity: number)
	{
		this.defnName = defnName;
		this.quantity = (quantity == null ? 1 : quantity);
	}

	apply(agent: Agent, target: any): void
	{
		this.defn().apply(this, agent, target);
	}

	defn(): ItemDefn
	{
		return Globals.Instance.universe.itemDefnsByName.get(this.defnName);
	}
}
