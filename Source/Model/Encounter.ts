
class Encounter
{
	defnName: string;
	parties: Party[];

	entities: Entity[];
	entitiesToSpawn: Entity[];
	entitiesToRemove: Entity[];
	agentCurrent: Agent;

	constructor(defnName: string, parties: Party[])
	{
		this.defnName = defnName;
		this.parties = parties;

		this.entities = [];
		this.entitiesToSpawn = [];
		this.entitiesToRemove = [];

		this.entitiesToSpawn = this.entitiesToSpawn.concat(this.parties);

		this.agentCurrent = null;
	}

	agentCurrentAdvance()
	{
		var agentNext = null;

		var hasAnyAgentNotMovedThisTurn = true;

		var agentsActive = this.agentsAll.filter(x => x.integrity > 0);

		for (var i = 0; i < agentsActive.length; i++)
		{
			var agent = agentsActive[i];
			if (agent.hasMovedThisTurn == false)
			{
				agentNext = agent;
				hasAnyAgentNotMovedThisTurn = false;
				break;
			}
		}

		if (hasAnyAgentNotMovedThisTurn == true)
		{
			for (var i = 0; i < agentsActive.length; i++)
			{
				var agent = agentsActive[i];
				agent.hasMovedThisTurn = false;
			}
			agentNext = agentsActive[0];
		}

		this.agentCurrent = agentNext;
	}

	defn()
	{
		return Globals.Instance.universe.encounterDefnsByName.get(this.defnName);
	}
	
	entitiesSpawn()
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
	}

	initialize()
	{
		this.entitiesSpawn();

		this.agentsAll = [];

		for (var p = 0; p < this.parties.length; p++)
		{
			var party = this.parties[p];
			var partyAgents = party.agents;

			this.agentsAll = this.agentsAll.concat(partyAgents);
		}

		this.agentCurrentAdvance();
	}

	partyCurrent()
	{
		return (this.agentCurrent.party);
	}

	updateForTimerTick(universe, world)
	{
		this.entitiesSpawn();

		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.updateEncounterForTimerTick(this);
		}

		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entity = this.entitiesToRemove[i];
			var indexToRemoveAt = this.entities.indexOf(entity);
			if (indexToRemoveAt >= 0) // hack
			{
				this.entities.splice(indexToRemoveAt, 1);
			}
		}

		this.entitiesToRemove.length = 0;

		this.updateForTimerTick_WinOrLose();

		this.draw(universe, world, Globals.Instance.display);
	};

	updateForTimerTick_WinOrLose()
	{
		for (var p = 0; p < this.parties.length; p++)
		{
			var party = this.parties[p];
			var partyAgentsActive = party.agentsActive();

			var areAnyAgentsInPartyAlive = partyAgentsActive.length > 0;

			if (areAnyAgentsInPartyAlive == false)
			{
				clearInterval(Globals.Instance.timer);
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

	draw(universe, world, display)
	{
		var encounter = this;
		display.clear();

		var encounterDefn = encounter.defn();
		var panes = encounterDefn.panes;

		for (var p = 0; p < panes.length; p++)
		{
			var pane = panes[p];
			pane.draw(universe, world, display);
		}

		var entities = encounter.entities;
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];

			if (entity.draw != null)
			{
				entity.draw(universe, world, display);
			}
		}
	}

}
