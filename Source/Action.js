
class Action
{
	constructor()
	{
		this.status = ActionStatus.Instances().None;
		this.parameters = [];
	}

	defn(agent)
	{
		var returnValue = agent.defn().actionDefns[this.defnName];

		if (returnValue == null)
		{
			returnValue = Globals.Instance.universe.actionDefns[this.defnName];
		}

		return returnValue;
	}

	target()
	{
		return this.parameters["Target"];
	}

	target_Set(valueToSet)
	{
		this.parameters["Target"] = valueToSet;
	}

	updateEncounterAndAgentForTimerTick(encounter, agent)
	{
		var intelligence = encounter.partyCurrent().intelligence;

		var actionStatuses = ActionStatus.Instances();
		if (this.status == actionStatuses.None)
		{
			intelligence.actionInitialize(this, encounter, agent);
		}
		else if (this.status == actionStatuses.AwaitingActionDefn)
		{
			intelligence.decideActionDefn(this, encounter, agent);
		}
		else if (this.status == actionStatuses.AwaitingTarget)
		{
			intelligence.decideActionTarget(this, encounter, agent);
		}
		else if (this.status == actionStatuses.Running)
		{
			var actionDefn = this.defn(agent);
			actionDefn.perform(encounter, agent, this);
		}
		else if (this.status == actionStatuses.Complete)
		{
			//encounter.entitiesToRemove.push(agent.action);
			agent.action = null;
			agent.hasMovedThisTurn = true;
			encounter.agentCurrentAdvance();
		}
		else
		{
			throw "Invalid action status: " + this.status.name;
		}
	}
}
