
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
		var intelligence = encounter.partyCurrent().intelligence;

		if (this.status == ActionStatus.Instances.None)
		{
			intelligence.actionInitialize(this, encounter, agent);
		}
		else if (this.status == ActionStatus.Instances.AwaitingActionDefn)
		{
			intelligence.decideActionDefn(this, encounter, agent);
		}
		else if (this.status == ActionStatus.Instances.AwaitingTarget)
		{
			intelligence.decideActionTarget(this, encounter, agent);
		}
		else if (this.status == ActionStatus.Instances.Running)
		{
			var actionDefn = this.defn(agent);
			actionDefn.perform(encounter, agent, this);
		}
		else if (this.status == ActionStatus.Instances.Complete)
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
