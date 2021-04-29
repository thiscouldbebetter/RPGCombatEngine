
class IntelligenceHuman
{
	actionInitialize(action: Action, encounter: Encounter, agent: Agent): void
	{
		var actionStatuses = ActionStatus.Instances();
		action.status = actionStatuses.AwaitingActionDefn;

		var actionDefns = agent.defn().actionDefns;

		var updateEncounter = (encounter, agent) =>
		{
			var agentAction = agent.action;
			var actionDefn = agentAction.defn(agent);
			var actionStatusNext;
			if (actionDefn.requiresTarget == true)
			{
				actionStatusNext = actionStatuses.AwaitingTarget;
			}
			else
			{
				actionStatusNext = actionStatuses.Complete;
			}
			action.status = actionStatusNext;
		}

		var panesByName = encounter.defn().panesByName;
		var paneMenuPlayer = panesByName.get("Menu_Player");

		var menuForActionDefns = new Menu
		(
			"Actions",
			paneMenuPlayer.pos, // pos
			new Coords(0, 8), // spacing
			null, // menuable
			null, // updateEncounter
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

	decideActionDefn(action: Action): void
	{
		// Do nothing.
	}

	decideActionTarget(action: Action, encounter: Encounter, agent: Agent): void
	{
		var target = action.target();
		if (target == null)
		{
			var agentsActive = encounter.parties[1].agentsActive();
			target = agentsActive[0];
			action.target_Set(target);
			action.parameterByNameSet
			(
				"EmptyForPosToReturnTo", new Empty(agent.pos.clone())
			);
		}

		var inputHelper = Globals.Instance.inputHelper;
		var keyPressed = inputHelper.keyPressed;
		var actionStatuses = ActionStatus.Instances();

		if (keyPressed == "Enter")
		{
			action.status = actionStatuses.Running;
		}
		else
		{
			var partyTargeted = target.party;
			var agentsInPartyTargeted = partyTargeted.agentsActive();

			if (keyPressed == "ArrowLeft")
			{
				var partyToTarget = encounter.parties[1];
				if (partyToTarget != partyTargeted)
				{
					target = partyToTarget.agents[0];
				}
			}
			else if (keyPressed == "ArrowRight")
			{
				var partyToTarget = encounter.parties[0];
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
