
function Encounter(defnName, parties)
{
	this.defnName = defnName;
	this.parties = parties;

	this.entities = [];
	this.entitiesToSpawn = [];
	this.entitiesToRemove = [];

	this.entitiesToSpawn = this.entitiesToSpawn.concat(this.parties);

	this.agentCurrent = null;
}

{
	Encounter.prototype.agentCurrentAdvance = function()
	{
		var agentNext = null;
		
		for (var i = 0; i < this.agentsAll.length; i++)
		{
			var agent = this.agentsAll[i];
			if (agent.hasMovedThisTurn == false)
			{
				agentNext = agent;
				haveAllAgentsMovedThisTurn = false;
				break;
			}
		}

		if (haveAllAgentsMovedThisTurn == true)
		{
			for (var i = 0; i < this.agentsAll.length; i++)
			{
				var agent = this.agentsAll[i];
				agent.hasMovedThisTurn = false;
			}
			agentNext = this.agentsAll[0];
		}

		this.agentCurrent = agentNext;
	}

	Encounter.prototype.defn = function()
	{
		return Globals.Instance.universe.encounterDefns[this.defnName];
	}

	Encounter.prototype.initialize = function()
	{
		this.agentsAll = [];

		for (var p = 0; p < this.parties.length; p++)
		{
			var party = this.parties[p];
			var partyAgents = party.agents;

			this.agentsAll = this.agentsAll.concat(partyAgents);
		}

		this.agentCurrentAdvance();
	}

	Encounter.prototype.partyCurrent = function()
	{
		return (this.agentCurrent.party);
	}

	Encounter.prototype.updateForTimerTick = function()
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entity = this.entitiesToSpawn[i];
			if (entity.initializeForEncounter != null)
			{
				entity.initializeForEncounter(this);
			}
			this.entities.push(entity);
		}

		this.entitiesToSpawn.length = 0;

		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.updateEncounterForTimerTick(this);
		}

		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entity = this.entitiesToRemove[i];
			this.entities.splice
			(
				this.entities.indexOf(entity),
				1
			);
		}

		this.entitiesToRemove.length = 0;

		this.updateForTimerTick_WinOrLose();

		this.drawToDisplay(Globals.Instance.display);
	}

	Encounter.prototype.updateForTimerTick_WinOrLose = function()
	{
		for (var p = 0; p < this.parties.length; p++)
		{
			var party = this.parties[p];
			var partyAgents = party.agents;

			var areAnyAgentsInPartyAlive = false;

			for (var a = 0; a < partyAgents.length; a++)
			{
				var agent = partyAgents[a];

				if (agent.integrity > 0)
				{
					areAnyAgentsInPartyAlive = true;
					break;
				}
			}

			if (areAnyAgentsInPartyAlive == false)
			{
				if (p == 0)
				{
					document.write("You lose!");
				}
				else
				{
					document.write("You win!");
				}
			}
		}
	}

	// drawable

	Encounter.prototype.drawToDisplay = function(display)
	{
		var encounter = this;
		display.clear();

		var encounterDefn = encounter.defn();
		var panes = encounterDefn.panes;

		for (var p = 0; p < panes.length; p++)
		{
			var pane = panes[p];
			pane.drawToDisplay(display);
		}

		var entities = encounter.entities;
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];

			if (entity.drawToDisplay != null)
			{
				entity.drawToDisplay(display);
			}
		}
	}

}
