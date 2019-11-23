
function IntelligenceHuman()
{}
{
	IntelligenceHuman.prototype.actionInitialize = function(action, encounter, agent)
	{
		action.status = ActionStatus.Instances.AwaitingActionDefn;

		var actionDefns = agent.defn().actionDefns;

		var updateEncounter = function()
		{
			var encounter = Globals.Instance.universe.encounter;
			var agent = encounter.agentCurrent;
			var agentAction = agent.action;
			agentAction.defnName = this.text; // hack
			var actionDefn = agentAction.defn(agent);
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

	IntelligenceHuman.prototype.decideActionDefn = function(action)
	{
		// Do nothing.
	}

	IntelligenceHuman.prototype.decideActionTarget = function(action, encounter, agent)
	{
		var target = action.target();
		if (target == null)
		{
			var agentsActive = encounter.parties[1].agentsActive();
			target = agentsActive[0];
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
			var agentsInPartyTargeted = partyTargeted.agentsActive();

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
