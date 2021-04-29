
class IntelligenceMachine
{
	actionInitialize(action: Action, encounter: Encounter, agent: Agent): void
	{
		action.status = ActionStatus.Instances().AwaitingActionDefn;
	}

	decideActionDefn(action: Action, encounter: Encounter, agent: Agent): void
	{
		var actionDefnsAvailable = agent.defn().actionDefns;
		var actionDefnIndex = Math.floor(Math.random(), actionDefnsAvailable.length);
		var actionDefnChosen = actionDefnsAvailable[actionDefnIndex];
		action.defnName = actionDefnChosen.name;

		action.status = ActionStatus.Instances().AwaitingTarget;
	}

	decideActionTarget(action: Action, encounter: Encounter, agent: Agent): void
	{
		var target = action.target();
		if (target == null)
		{
			var partyToTarget = encounter.parties[0];
			var agentsToTarget = partyToTarget.agentsActive();
			var agentToTargetIndex = Math.floor(Math.random() * agentsToTarget.length);
			target = agentsToTarget[agentToTargetIndex];
			action.target_Set(target);
			action.parameterByName.set
			(
				"EmptyForPosToReturnTo", new Empty(agent.pos.clone())
			);
		}

		action.status = ActionStatus.Instances().Running;
	}
}
