
function IntelligenceHuman()
{}
{
	IntelligenceHuman.prototype.decideAction = function(action)
	{
		var encounter = Globals.Instance.universe.encounter;
		var agent = encounter.agentCurrent;

		var target = action.target();
		if (target == null)
		{
			target = encounter.parties[1].agents[0];
			action.target_Set(target);
			action.parameters["EmptyForPosToReturnTo"] = new Empty(agent.pos.clone());
		}

		var inputHelper = Globals.Instance.inputHelper;
		var keyPressed = inputHelper.keyPressed;
	
		if (keyPressed == "Enter")
		{
			action.status = ActionStatus.Instances.Running;
		}
		else
		{
			var partyTargeted = target.party;
			var agentsInPartyTargeted = partyTargeted.agents;

			if (keyPressed == "ArrowLeft")
			{
				partyToTarget = encounter.parties[1];
				if (partyToTarget != partyTargeted)
				{
					target = partyToTarget.agents[0];
				}
			}
			else if (keyPressed == "ArrowRight")
			{
				partyToTarget = encounter.parties[0];
				if (partyToTarget != partyTargeted)
				{
					target = partyToTarget.agents[0];
				}
			}
			else if (keyPressed == "ArrowDown")
			{
				var indexOfAgentToTarget = agentsInPartyTargeted.indexOf(target) + 1;
				if (indexOfAgentToTarget >= agentsInPartyTargeted.length)
				{
					indexOfAgentToTarget = 0;
				}
				target = agentsInPartyTargeted[indexOfAgentToTarget];
			}
			else if (keyPressed == "ArrowUp")
			{		
				var indexOfAgentToTarget = agentsInPartyTargeted.indexOf(target) - 1;
				if (indexOfAgentToTarget < 0)
				{
					indexOfAgentToTarget = agentsInPartyTargeted.length - 1;
				}
				target = agentsInPartyTargeted[indexOfAgentToTarget];
			}

			action.target_Set(target);
		}
	}
}
