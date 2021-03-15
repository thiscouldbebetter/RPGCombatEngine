
class IntelligenceMachine
{
	actionInitialize(action, encounter, agent)
	{
		action.status = ActionStatus.Instances().AwaitingActionDefn;
	}

	decideActionDefn(action, encounter, agent)
	{
		var actionDefnsAvailable = agent.defn().actionDefns;
		var actionDefnIndex = Math.floor(Math.random(), actionDefnsAvailable.length);
		var actionDefnChosen = actionDefnsAvailable[actionDefnIndex];
		action.defnName = actionDefnChosen.name;

		action.status = ActionStatus.Instances().AwaitingTarget;
	}

	decideActionTarget(action, encounter, agent)
	{
		var target = action.target();
		if (target == null)
		{
			var partyToTarget = encounter.parties[0];
			var agentsToTarget = partyToTarget.agentsActive();
			var agentToTargetIndex = Math.floor(Math.random() * agentsToTarget.length);
			target = agentsToTarget[agentToTargetIndex];
			action.target_Set(target);
			action.parameters["EmptyForPosToReturnTo"] = new Empty(agent.pos.clone());
		}

		action.status = ActionStatus.Instances().Running;
	}
}
