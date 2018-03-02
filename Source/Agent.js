
function Agent(name, defnName, pos, itemsEquipped, itemsInInventory)
{
	this.name = name;
	this.defnName = defnName;
	this.pos = pos;
	this.itemsEquipped = itemsEquipped;
	this.itemsInInventory = itemsInInventory;

	this.action = null;
	this.effects = [];

	this.hasMovedThisTurn = false;
}

{
	Agent.prototype.defn = function()
	{
		return Globals.Instance.universe.agentDefns[this.defnName];
	}

	Agent.prototype.initializeForEncounter = function(encounter)
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
					this.itemsEquipped[categoryName] = item;
				}
			}
		}
	}

	Agent.prototype.updateEncounterForTimerTick = function(encounter)
	{
		if (encounter.agentCurrent == this)
		{
			if (this.action == null)
			{
				this.action = new Action();
			}
	
			this.action.updateEncounterAndAgentForTimerTick
			(
				encounter,
				this
			);
		}
	}

	// menuable

	Agent.prototype.toMenu = function()
	{
		var universe = Globals.Instance.universe;
		var encounter = universe.encounter;
		var panes = encounter.defn().panes;
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
			panes["Menu_Player"].pos, // pos
			new Coords(0, 8), // spacing
			this, // menuable
			null, // updateEncounter
			null, // children
			0 // indexOfChildSelected
		);

		return returnMenu;
	}

	// drawable

	Agent.prototype.drawToDisplay = function(display)
	{
		var agent = this;
		var agentDefn = agent.defn();
		agentDefn.visual.drawToDisplayForDrawable(display, this);

		var encounter = Globals.Instance.universe.encounter;
		var agentCurrent = encounter.agentCurrent;

		if (agent == agentCurrent)
		{
			var arrowSizeInPixels = agentDefn.sizeInPixels;

			display.drawArrow
			(
				agent.pos,
				arrowSizeInPixels
			);

			var action = agent.action;
			if (action != null)
			{
				var actionTarget = action.target();

				if (actionTarget != null)
				{
					display.drawArrow
					(
						actionTarget.pos,
						arrowSizeInPixels
					);
				}
			}
		}

	}

}