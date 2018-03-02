
// classes

function Action()
{
	this.status = ActionStatus.Instances.None;
	this.parameters = [];
}

{
	// instance methods

	Action.prototype.defn = function(agent)
	{
		var returnValue = agent.defn().actionDefns[this.defnName];

		if (returnValue == null)
		{
			returnValue = Globals.Instance.universe.actionDefns[this.defnName];
		}

		return returnValue;
	}

	Action.prototype.target = function()
	{
		return this.parameters["Target"];
	}

	Action.prototype.target_Set = function(valueToSet)
	{
		this.parameters["Target"] = valueToSet;
	}

	Action.prototype.updateEncounterAndAgentForTimerTick = function(encounter, agent)
	{
		var display = Globals.Instance.display;

		if (this.status == ActionStatus.Instances.None)
		{
			this.status = ActionStatus.Instances.AwaitingActionDefn;

			var actionDefns = agent.defn().actionDefns;

			var updateEncounter = function()
			{
				var encounter = Globals.Instance.universe.encounter;
				var agent = encounter.agentCurrent;
				var action = agent.action;
				action.defnName = this.text; // hack
				var actionDefn = action.defn(agent);
				if (actionDefn.requiresTarget == true)
				{
					actionStatusNext = ActionStatus.Instances.AwaitingTarget;
				}
				else
				{
					actionStatusNext = ActionStatus.Instances.Complete;
				}
				action.status = actionStatusNext;
			}

			var panes = encounter.defn().panes;

			var menuForActionDefns = new Menu
			(
				"Actions",
				panes["Menu_Player"].pos, // pos
				new Coords(0, 8), // spacing
				null, // updateEncounter
				null, // menuable
				Menu.menuablesToMenus
				(
					actionDefns,
					[ "name" ], // bindingPathsForMenuText
					updateEncounter
				),
				0 // indexOfChildSelected
			);

			encounter.entitiesToSpawn.push(menuForActionDefns);
		}
		else if (this.status == ActionStatus.Instances.AwaitingActionDefn)
		{
			// do nothing	
		}
		else if (this.status == ActionStatus.Instances.AwaitingTarget)
		{
			var intelligence = encounter.partyCurrent().intelligence;
			intelligence.decideAction(this);
		}
		else if (this.status == ActionStatus.Instances.Running)
		{
			var actionDefn = this.defn(agent);
			actionDefn.perform(encounter, agent, this);
		}
		else if (this.status == ActionStatus.Instances.Complete)
		{
			encounter.entitiesToRemove.push(agent.action);
			agent.action = null;
			agent.hasMovedThisTurn = true;
			encounter.agentCurrentAdvance();
		}
	}
}
