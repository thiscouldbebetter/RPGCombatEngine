
// demo

function DemoData()
{
	// do nothing
}
{
	DemoData.prototype.universe = function()
	{
		var imageDirectory = "../Media/Images/";

		var imageLibrary = new ImageLibrary
		([
			new Image("Agents", imageDirectory + "Agents.png"),
			new Image("Goblin", imageDirectory + "Goblin.png"),
			new Image("Troll", imageDirectory + "Troll.png"),
		]);

		var effectDefns = [];

		var categories =
		[
			new Category("Consumable"),
			new Category("Valuable"),
			new Category("Weapon"),
		].addLookups("name");

		var itemDefns = this.universe_1_ItemDefns(categories);

		var actionDefnsCommon = this.universe_2_ActionDefns();

		var agentDefns = this.universe_3_AgentDefns(actionDefnsCommon);

		var encounterDefns =
		[
			new EncounterDefn
			(
				"Default",
				// panes
				[
					new Pane("Field_Other", new Coords(0, 0), new Coords(225, 150)),
					new Pane("Field_Player", new Coords(225, 0), new Coords(75, 150)),
					new Pane("Status_Other", new Coords(0, 150), new Coords(100, 75)),
					new Pane("Status_Player", new Coords(100, 150), new Coords(125, 75)),
					new Pane("Menu_Player", new Coords(225, 150), new Coords(75, 75)),
				]
			),
		].addLookups("name");

		var encounter = this.universe_4_Encounter(encounterDefns, agentDefns, itemDefns);

		var universe = new Universe
		(
			"Universe0",
			imageLibrary,
			actionDefnsCommon,
			agentDefns,
			effectDefns,
			encounterDefns,
			itemDefns,
			encounter
		);

		return universe;

	} // end method

	DemoData.prototype.universe_1_ItemDefns = function(categories)
	{
		var itemDefns =
		[
			// consumables

			new ItemDefn
			(
				"Heal Potion",
				[ categories["Consumable"].name ],
				function apply(item, agent, target)
				{
					var items = agent.itemsInInventory;
					items.splice
					(
						items.indexOf(item), 1
					);
					target.integrity = Math.trimValueToMinAndMax
					(
						target.integrity + 20, 0, target.defn().integrityMax
					);
				}
			),

			new ItemDefn
			(
				"Energy Potion",
				[ categories["Consumable"].name ],
				function apply(item, agent, target)
				{
					var items = agent.itemsInInventory;
					items.splice
					(
						items.indexOf(item), 1
					);
					target.energy = NumberHelper.trimValueToMinAndMax
					(
						target.energy + 20, 0, target.defn().energyMax
					)
				}
			),

			// valuables

			new ItemDefn
			(
				"Coin",
				[ categories["Valuable"].name ],
				function apply(item, agent, target)
				{
					// Do nothing.
				}
			),

			// weapons

			new ItemDefn
			(
				"Club",
				[ categories["Weapon"].name ],
				function apply(item, agent, target)
				{
					target.integrity -= 5;
				}
			),

			new ItemDefn
			(
				"Dagger",
				[ categories["Weapon"].name ],
				function apply(item, agent, target)
				{
					target.integrity -= 2;
				}
			),

			new ItemDefn
			(
				"Mace",
				[ categories["Weapon"].name ],
				// apply
				function(item, agent, target)
				{
					target.integrity -= 6;
				}
			),

			new ItemDefn
			(
				"Sword",
				[ categories["Weapon"].name ],
				function apply(item, agent, target)
				{
					target.integrity -= 10;
				}
			),
		];

		itemDefns.addLookups("name");

		return itemDefns;

	}

	DemoData.prototype.universe_2_ActionDefns = function()
	{
		var actionDefnsCommon =
		[
			new ActionDefn
			(
				"Attack",
				true, // requiresTarget
				function perform(encounter, agent, action)
				{
					var target = action.target();
					var displacementFromAgentToTarget = target.pos.clone().subtract
					(
						agent.pos
					);

					var distanceToTarget = displacementFromAgentToTarget.magnitude();

					var distanceToMovePerTick = 16;

					if (distanceToTarget > distanceToMovePerTick)
					{
						var displacementToMove = displacementFromAgentToTarget.divideScalar
						(
							distanceToTarget
						).multiplyScalar
						(
							distanceToMovePerTick
						);

						agent.pos.add(displacementToMove);
					}
					else
					{
						var emptyToReturnTo = action.parameters["EmptyForPosToReturnTo"];

						if (target.integrity == null)
						{
							agent.pos.overwriteWith(emptyToReturnTo.pos);
							action.target_Set(null);
							action.status = ActionStatus.Instances.Complete;
						}
						else
						{
							var weaponEquipped = agent.itemsEquipped["Weapon"];
							if (weaponEquipped != null)
							{
								weaponEquipped.apply(agent, target);
							}
							if (target.integrity <= 0)
							{
								target.integrity = 0;
								encounter.entitiesToRemove.push(target);
							}
							action.target_Set(emptyToReturnTo);
						}
					}
				},
				null // toMenu
			),

			new ActionDefn
			(
				"Defend",
				false, // requiresTarget
				function perform(encounter, agent, action)
				{
					action.status = ActionStatus.Instances.Complete;
				},
				null // toMenu
			),

			new ActionDefn
			(
				"Magic",
				true, // requiresTarget
				// updateEncounter
				function perform(encounter, agent, action)
				{
					action.status = ActionStatus.Instances.Complete;
				},
				// toMenu
				function()
				{
					var universe = Globals.Instance.universe;
					var encounter = universe.encounter;
					var panes = encounter.defn().panes;
					var agent = encounter.agentCurrent;
					var spellDefns = agent.defn().spellDefns;

					var returnMenu = new Menu
					(
						"Magic",
						panes["Menu_Player"].pos, // pos
						new Coords(0, 8), // spacing
						null, // menuable
						null, // updateEncounter
						Menu.menuablesToMenus
						(
							spellDefns,
							[ "name" ], // bindingPathsForMenuText
							function (encounter)
							{
								var spellDefn = this.menuable;
								var agent = encounter.agentCurrent;
								var action = agent.action;
								action.parameters["SpellDefn"] = spellDefn;
								action.defnName = "Spell";
								action.status = ActionStatus.Instances.AwaitingTarget;
							}
						),
						0 // indexOfChildSelected
					);

					return returnMenu;
				}
			),

			new ActionDefn
			(
				"Spell",
				true, // requiresTarget
				function perform(encounter, agent, action)
				{
					var target = action.target();
					var displacementFromAgentToTarget = target.pos.clone().subtract
					(
						agent.pos
					);

					var distanceToTarget = displacementFromAgentToTarget.magnitude();

					var distanceToMovePerTick = 16;

					if (distanceToTarget > distanceToMovePerTick)
					{
						var displacementToMove = displacementFromAgentToTarget.divideScalar
						(
							distanceToTarget
						).multiplyScalar
						(
							distanceToMovePerTick
						);

						agent.pos.add(displacementToMove);
					}
					else
					{
						var emptyToReturnTo = action.parameters["EmptyForPosToReturnTo"];

						if (target.integrity == null)
						{
							agent.pos.overwriteWith(emptyToReturnTo.pos);
							action.target_Set(null);
							action.status = ActionStatus.Instances.Complete;
						}
						else
						{
							var spellDefn = action.parameters["SpellDefn"];
							spellDefn.apply
							(
								agent,
								target
							);
							if (target.integrity <= 0)
							{
								target.integrity = 0;
								encounter.entitiesToRemove.push(target);
							}
							action.target_Set(emptyToReturnTo);
						}
					}
				},
				null // toMenu
			),

			new ActionDefn
			(
				"Item",
				false, // requiresTarget
				function perform(encounter, agent, action)
				{
					action.status = ActionStatus.Instances.Complete;
				},
				function toMenu()
				{
					var universe = Globals.Instance.universe;
					var encounter = universe.encounter;
					var panes = encounter.defn().panes;
					var agent = encounter.agentCurrent;
					var items = agent.itemsInInventory;

					var returnMenu = new Menu
					(
						"Items",
						panes["Menu_Player"].pos, // pos
						new Coords(0, 8), // spacing
						null, // menuable
						function updateEncounter(encounter)
						{
							var agent = encounter.agentCurrent;
							var action = agent.action;
							action.status = ActionStatus.Instances.None;
						},
						Menu.menuablesToMenus
						(
							items,
							[ "defn().name" ], // bindingPathsForMenuText
							function (encounter)
							{
								var item = this.menuable;
								var agent = encounter.agentCurrent;
								var action = agent.action;
								action.defnName = "ItemUse";
								agent.itemsEquipped["ItemToUse"] = item;
								action.status = ActionStatus.Instances.AwaitingTarget;
							}
						),
						0 // indexOfChildSelected
					);

					return returnMenu;
				}
			),

			new ActionDefn
			(
				"ItemUse",
				true, // requiresTarget
				function perform(encounter, agent, action)
				{
					var target = action.target();
					var displacementFromAgentToTarget = target.pos.clone().subtract
					(
						agent.pos
					);

					var distanceToTarget = displacementFromAgentToTarget.magnitude();

					var distanceToMovePerTick = 16;

					if (distanceToTarget > distanceToMovePerTick)
					{
						var displacementToMove = displacementFromAgentToTarget.divideScalar
						(
							distanceToTarget
						).multiplyScalar
						(
							distanceToMovePerTick
						);

						agent.pos.add(displacementToMove);
					}
					else
					{
						var emptyToReturnTo = action.parameters["EmptyForPosToReturnTo"];

						if (target.integrity == null)
						{
							agent.pos.overwriteWith(emptyToReturnTo.pos);
							action.target_Set(null);
							action.status = ActionStatus.Instances.Complete;
						}
						else
						{
							var itemEquipped = agent.itemsEquipped["ItemToUse"];
							if (itemEquipped != null)
							{
								itemEquipped.apply(agent, target);
							}
							action.target_Set(emptyToReturnTo);
						}
					}
				},
				null // toMenu
			),

			new ActionDefn
			(
				"Wait",
				false, // requiresTarget
				function perform(encounter, agent, action)
				{
					encounter.agentCurrentAdvance();
				},
				null // toMenu
			),

			new ActionDefn
			(
				"Run",
				false, // requiresTarget
				function perform(encounter, agent, action)
				{
					// todo
					action.status = ActionStatus.Instances.Complete;
				},
				null // toMenu
			),
		];

		actionDefnsCommon.addLookups("name");

		return actionDefnsCommon;
	}

	DemoData.prototype.universe_3_AgentDefns = function(actionDefnsCommon)
	{
		var agentSizeInPixelsStandard = new Coords(24, 24);

		var visualAgentLabel = new VisualDynamic
		(
			function drawToDisplayForDrawable(display, drawable)
			{
				var agent = drawable;
				var agentDefn = agent.defn();
				var agentText = "\n";
				if (agent.name != null)
				{
					agentText += agent.name + "\n";
				}
				agentText += agentDefn.name;
				display.drawText
				(
					agentText, agent.pos,
					display.colorFore, display.colorBack
				);
			}
		);

		var agentDefns =
		[
			new AgentDefn
			(
				"Mage",
				new VisualGroup
				([
					new VisualFallthrough
					([
						new VisualImageSlice
						(
							"Agents",
							new Coords(0, 0).multiply
							(
								agentSizeInPixelsStandard
							),
							agentSizeInPixelsStandard
						),
						new VisualRectangle
						(
							agentSizeInPixelsStandard,
							null, // colorFill
							"LightGray"
						),
					]),
					visualAgentLabel,
				]),
				agentSizeInPixelsStandard,
				10, //integrityMax,
				20, //energyMax,
				new Range(1, 10), // initiativeRange
				//actionDefns
				[
					actionDefnsCommon["Attack"],
					actionDefnsCommon["Magic"],
					actionDefnsCommon["Item"],
					actionDefnsCommon["Wait"],
				],
				// spellDefns
				[
					new SpellDefn
					(
						"Fire",
						function apply(agent, target)
						{
							var energyNeeded = 5;
							if (agent.energy > energyNeeded)
							{
								agent.energy -= energyNeeded;
								target.integrity -= 20;
							}
						}
					),
				]
			),

			new AgentDefn
			(
				"Priest",
				new VisualGroup
				([
					new VisualFallthrough
					([
						new VisualImageSlice
						(
							"Agents",
							new Coords(1, 0).multiply
							(
								agentSizeInPixelsStandard
							),
							agentSizeInPixelsStandard
						),
						new VisualRectangle
						(
							agentSizeInPixelsStandard,
							null, // colorFill
							"LightGray"
						),
					]),
					visualAgentLabel,
				]),
				agentSizeInPixelsStandard,
				20, //integrityMax,
				20, //energyMax,
				new Range(1, 10), // initiativeRange
				//actionDefns
				[
					actionDefnsCommon["Attack"],
					actionDefnsCommon["Magic"],
					actionDefnsCommon["Item"],
					actionDefnsCommon["Wait"],
				],
				// spellDefns
				[
					new SpellDefn
					(
						"Heal",
						// apply
						function(agent, target)
						{
							agent.energy = NumberHelper.trimValueToMinAndMax
							(
								agent.energy + 5, 0, agent.defn().energyMax
							);

							var integrityToHeal = 20;
							target.integrity = NumberHelper.trimValueToMinAndMax
							(
								target.integrity + integrityToHeal,
								0, // min
								target.defn().integrityMax // max
							);
						}
					),
				]
			),

			new AgentDefn
			(
				"Rogue",
				new VisualGroup
				([
					new VisualFallthrough
					([
						new VisualImageSlice
						(
							"Agents",
							new Coords(3, 0).multiply
							(
								agentSizeInPixelsStandard
							),
							agentSizeInPixelsStandard
						),
						new VisualRectangle
						(
							agentSizeInPixelsStandard,
							null, // colorFill
							"LightGray"
						),
					]),
					visualAgentLabel,
				]),
				agentSizeInPixelsStandard,
				20, //integrityMax,
				0, //energyMax,
				new Range(5, 10), // initiativeRange
				//actionDefns
				[
					actionDefnsCommon["Attack"],
					actionDefnsCommon["Item"],
					actionDefnsCommon["Wait"],
				],
				null // spellDefns
			),

			new AgentDefn
			(
				"Warrior",
				new VisualGroup
				([
					new VisualFallthrough
					([
						new VisualImageSlice
						(
							"Agents",
							new Coords(2, 0).multiply
							(
								agentSizeInPixelsStandard
							),
							agentSizeInPixelsStandard
						),
						new VisualRectangle
						(
							agentSizeInPixelsStandard,
							null, // colorFill
							"LightGray"
						),
					]),
					visualAgentLabel,
				]),
				agentSizeInPixelsStandard,
				30, //integrityMax,
				0, //energyMax,
				new Range(1, 10), // initiativeRange
				//actionDefns
				[
					actionDefnsCommon["Attack"],
					actionDefnsCommon["Item"],
					actionDefnsCommon["Wait"],
				],
				null // spellDefns
			),

			// non-players

			new AgentDefn
			(
				"Goblin",
				new VisualGroup
				([
					new VisualFallthrough
					([
						new VisualImage("Goblin"),
						new VisualRectangle
						(
							new Coords(24, 24),
							null, // colorFill
							"LightGray"
						),
					]),
					visualAgentLabel,
				]),
				new Coords(40, 40), // size
				8, //integrityMax,
				0, //energyMax,
				new Range(1, 10), // initiativeRange
				//actionDefns
				[
					actionDefnsCommon["Attack"],
				],
				null // spellDefns
			),

			new AgentDefn
			(
				"Troll",
				new VisualGroup
				([
					new VisualFallthrough
					([
						new VisualImage("Troll"),
						new VisualRectangle
						(
							new Coords(40, 40),
							null, // colorFill
							"LightGray"
						),
					]),
					visualAgentLabel,
				]),
				new Coords(40, 40), // size
				50, //integrityMax,
				0, //energyMax,
				new Range(1, 10), // initiativeRange
				//actionDefns
				[
					actionDefnsCommon["Attack"],
				],
				null // spellDefns
			),
		];

		agentDefns.addLookups("name");

		return agentDefns;
	}

	DemoData.prototype.universe_4_Encounter = function(encounterDefns, agentDefns, itemDefns)
	{
		var encounter = new Encounter
		(
			encounterDefns["Default"].name,
			// parties
			[
				new Party
				(
					"Player",
					new IntelligenceHuman(),
					[
						new Agent
						(
							"One",
							agentDefns["Mage"].name,
							new Coords(256, 20),
							// itemsEquipped
							[
								new Item(itemDefns["Dagger"].name)
							],
							// itemsInInventory
							[
								new Item(itemDefns["Energy Potion"].name),
								new Item(itemDefns["Energy Potion"].name),
								new Item(itemDefns["Energy Potion"].name),
							]
						),
						new Agent
						(
							"Two",
							agentDefns["Priest"].name,
							new Coords(256, 50),
							// itemsEquipped
							[
								new Item(itemDefns["Mace"].name)
							],
							[
								new Item(itemDefns["Heal Potion"].name),
								new Item(itemDefns["Heal Potion"].name),
								new Item(itemDefns["Heal Potion"].name),
							] // itemsInInventory
						),
						new Agent
						(
							"Three",
							agentDefns["Warrior"].name,
							new Coords(256, 80),
							// itemsEquipped
							[
								new Item(itemDefns["Sword"].name)
							],
							[] // itemsInInventory
						),
						new Agent
						(
							"Four",
							agentDefns["Rogue"].name,
							new Coords(256, 110),
							// itemsEquipped
							[
								new Item(itemDefns["Dagger"].name)
							],
							[] // itemsInInventory
						),
					]
				),
				new Party
				(
					"Other",
					new IntelligenceMachine(),
					[
						new Agent
						(
							null, // name
							agentDefns["Troll"].name,
							new Coords(90, 20),
							[ new Item(itemDefns["Club"].name) ], // itemsEquipped
							[ new Item(itemDefns["Coin"].name, 5) ] // itemsInInventory
						),
						new Agent
						(
							null, // name
							agentDefns["Goblin"].name,
							new Coords(30, 50),
							[ new Item(itemDefns["Dagger"].name) ], // itemsEquipped
							[ new Item(itemDefns["Coin"].name, 1) ] // itemsInInventory
						),
						new Agent
						(
							null, // name
							agentDefns["Goblin"].name,
							new Coords(90, 80),
							[ new Item(itemDefns["Dagger"].name) ], // itemsEquipped
							[ new Item(itemDefns["Coin"].name, 1) ] // itemsInInventory
						),
						new Agent
						(
							null, // name
							agentDefns["Goblin"].name,
							new Coords(150, 50),
							[ new Item(itemDefns["Dagger"].name) ], // itemsEquipped
							[ new Item(itemDefns["Coin"].name, 1) ]
						),
					]
				),
			]
		);

		return encounter;
	}

} // end class DemoData
