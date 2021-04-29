
class Agent
{
	name: string;
	defnName: string;
	pos: Coords;
	itemsEquipped: Item[];
	itemsInInventory: Item[];

	itemsEquippedByName: Map<string, Item>;
	action: Action;
	effects: Effect[];
	hasMovedThisTurn: boolean;
	_visualArrow: VisualArrow;

	constructor
	(
		name: string, defnName: string, pos: Coords,
		itemsEquipped: Item[], itemsInInventory: Item[]
	)
	{
		this.name = name;
		this.defnName = defnName;
		this.pos = pos;
		this.itemsEquipped = itemsEquipped || [];
		this.itemsInInventory = itemsInInventory || [];

		this.itemsEquippedByName =
			ArrayHelper.addLookupsByName(this.itemsEquipped);

		this.action = null;
		this.effects = [];

		this.hasMovedThisTurn = false;

		this._visualArrow = new VisualArrow();
	}

	defn(): AgentDefn
	{
		return Globals.Instance.universe.agentDefnsByName.get(this.defnName);
	}

	initializeForEncounter(encounter: Encounter): void
	{
		var defn = this.defn();
		this.integrity = defn.integrityMax;
		this.energy = defn.energyMax;
		this.hasMovedThisTurn = false;

		if (this.itemsEquipped != null)
		{
			for (var i = 0; i < this.itemsEquipped.length; i++)
			{
				var item = this.itemsEquipped[i];
				var itemDefn = item.defn();
				var categoryNames = itemDefn.categoryNames;
				for (var c = 0; c < categoryNames.length; c++)
				{
					var categoryName = categoryNames[c];
					this.itemsEquippedByName.set(categoryName, item);
				}
			}
		}
	}

	updateEncounterForTimerTick(encounter: Encounter): void
	{
		if (encounter.agentCurrent == this)
		{
			if (this.action == null)
			{
				this.action = new Action(ActionStatus.Instances().None);
			}

			this.action.updateEncounterAndAgentForTimerTick
			(
				encounter,
				this
			);
		}
	}

	// menuable

	toMenu(): Menu
	{
		var universe = Globals.Instance.universe;
		var encounter = universe.encounter;
		var panesByName = encounter.defn().panesByName;
		var agentDefn = this.defn();
		var spellDefns = agentDefn.spellDefns;

		var textForAgent;
		if (this.name == null) // hack
		{
			textForAgent = agentDefn.name;
		}
		else
		{
			textForAgent = this.name;
		}

		textForAgent += 
			" ("
			+ "H:" + this.integrity + "/" + agentDefn.integrityMax;

		if (agentDefn.energyMax > 0)
		{
			textForAgent += 
				" E:" + this.energy + "/" + agentDefn.energyMax
		}

		textForAgent += ")";

		var returnMenu = new Menu
		(
			textForAgent,
			panesByName.get("Menu_Player").pos, // pos
			new Coords(0, 8), // spacing
			this, // menuable
			null, // updateEncounter
			null, // children
			0 // indexOfChildSelected
		);

		return returnMenu;
	}

	// drawable

	draw(universe: Universe, world: World, display: Display): void
	{
		var agentDefn = this.defn();
		agentDefn.visual.draw(universe, world, display, this);

		var encounter = universe.encounter;
		var agentCurrent = encounter.agentCurrent;

		if (this == agentCurrent)
		{
			this._visualArrow.draw(universe, world, display, this);

			var action = this.action;
			if (action != null)
			{
				var actionTarget = action.target();

				if (actionTarget != null)
				{
					this._visualArrow.draw(universe, world, display, actionTarget);
				}
			}
		}

	}

}
