
class Action
{
	status: ActionStatus;
	parametersByName: Map<string, any>;

	constructor()
	{
		this.status = ActionStatus.Instances().None;
		this.parametersByName = new Map<string, any>();
	}

	defn(agent: Agent): ActionDefn
	{
		var returnValue = agent.defn().actionDefnsByName.get(this.defnName);

		if (returnValue == null)
		{
			returnValue =
				Globals.Instance.universe.actionDefnsByName.get(this.defnName);
		}

		return returnValue;
	}

	parameterByName(parameterName: string): any
	{
		return this.parametersByName.get(parameterName);
	}

	parameterByNameSet(parameterName: string, value: any): void
	{
		return this.parametersByName.set(parameterName, value);
	}

	target(): any
	{
		return this.parameterByName("Target");
	}

	target_Set(valueToSet: any): void
	{
		this.parameterByNameSet("Target", valueToSet);
	}

	updateEncounterAndAgentForTimerTick(encounter: Encounter, agent: Agent): void
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
