
function Party(name, intelligence, agents)
{
	this.name = name;
	this.intelligence = intelligence;
	this.agents = agents;

	this.agentIndexCurrent = null;

	for (var i = 0; i < this.agents.length; i++)
	{
		var agent = this.agents[i];
		agent.party = this;
	}
}

{
	Party.prototype.agentCurrent = function()
 	{
		return (this.agentIndexCurrent == null ? null : this.agents[this.agentIndexCurrent]);
	}

	Party.prototype.agentCurrentAdvance = function()
	{
		if (this.agentIndexCurrent == null)
		{
			this.agentIndexCurrent = 0;
		}
		else
		{
			this.agentIndexCurrent++;
			if (this.agentIndexCurrent >= this.agents.length)
			{
				this.agentIndexCurrent = 0;
			}
		}
	}

	Party.prototype.initializeForEncounter = function(encounter)
	{
		for (var i = 0; i < this.agents.length; i++)
		{
			var agent = this.agents[i];
			encounter.entitiesToSpawn.push(agent);
		}
	}

	Party.prototype.updateEncounterForTimerTick = function(encounter)
	{
		// do nothing
	}

	// drawable

	Party.prototype.drawToDisplay = function(display)
	{
		var panes = Globals.Instance.universe.encounter.defn().panes;

		var paneForStatus = panes["Status_" + this.name];

		var menuForParty = new Menu
		(
			"Party",
			paneForStatus.pos,
			new Coords(0, 8), // spacing
			null, // updateEncounter
			this, // menuable
			Menu.menuablesToMenus
			(
				this.agents,
				[ "name", "integrity", "defn().integrityMax" ], // bindingPathsForDisplayText
				null // updateEncounter
			)
		)

		menuForParty.drawToDisplay(display);
	}
}
