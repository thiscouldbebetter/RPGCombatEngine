
class Party
{
	name: string;
	intelligence: any;
	agents: Agent[];

	agentIndexCurrent: number;

	constructor(name: string, intelligence: any, agents: Agent[])
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

	agentCurrent(): Agent
 	{
		return
		(
			this.agentIndexCurrent == null ? null : this.agents[this.agentIndexCurrent]
		);
	}

	agentCurrentAdvance(): void
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

	agentsActive(): Agent[]
	{
		return this.agents.filter(x => x.integrity > 0);
	}

	initializeForEncounter(encounter: Encounter): void
	{
		for (var i = 0; i < this.agents.length; i++)
		{
			var agent = this.agents[i];
			encounter.entitiesToSpawn.push(agent);
		}
	}

	updateEncounterForTimerTick(encounter: Encounter): void
	{
		// do nothing
	}

	// drawable

	draw(universe: Universe, world: World, display: Display): void
	{
		var panesByName = universe.encounter.defn().panesByName;

		var paneForStatus = panesByName.get("Status_" + this.name);

		var menuForParty = new Menu
		(
			"Party",
			paneForStatus.pos,
			Coords.fromXY(0, 8), // spacing
			this, // menuable
			null, // updateEncounter
			Menu.menuablesToMenus
			(
				this.agents,
				[ "name", "integrity", "defn().integrityMax" ], // bindingPathsForDisplayText
				null // updateEncounter
			)
		)

		menuForParty.draw(universe, world, display);
	}
}
