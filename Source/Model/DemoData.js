"use strict";
class DemoData {
    universe() {
        var imageDirectory = "../Media/Images/";
        var imageLibrary = new ImageLibrary([
            new Image3("Agents", imageDirectory + "Agents.png"),
            new Image3("Goblin", imageDirectory + "Goblin.png"),
            new Image3("Troll", imageDirectory + "Troll.png"),
        ]);
        var effectDefns = [];
        var categories = [
            new Category("Consumable"),
            new Category("Valuable"),
            new Category("Weapon"),
        ];
        var categoriesByName = ArrayHelper.addLookupsByName(categories);
        var itemDefns = this.universe_1_ItemDefns(categoriesByName);
        var itemDefnsByName = ArrayHelper.addLookupsByName(itemDefns);
        var actionDefnsCommon = this.universe_2_ActionDefns();
        var actionDefnsCommonByName = ArrayHelper.addLookupsByName(actionDefnsCommon);
        var agentDefns = this.universe_3_AgentDefns(actionDefnsCommonByName);
        var agentDefnsByName = ArrayHelper.addLookupsByName(agentDefns);
        var encounterDefns = [
            new EncounterDefn("Default", 
            // panes
            [
                new Pane("Field_Other", Coords.fromXY(0, 0), Coords.fromXY(225, 150)),
                new Pane("Field_Player", Coords.fromXY(225, 0), Coords.fromXY(75, 150)),
                new Pane("Status_Other", Coords.fromXY(0, 150), Coords.fromXY(100, 75)),
                new Pane("Status_Player", Coords.fromXY(100, 150), Coords.fromXY(125, 75)),
                new Pane("Menu_Player", Coords.fromXY(225, 150), Coords.fromXY(75, 75)),
            ]),
        ];
        var encounterDefnsByName = ArrayHelper.addLookupsByName(encounterDefns);
        var encounter = this.universe_4_Encounter(encounterDefnsByName, agentDefnsByName, itemDefnsByName);
        var universe = new Universe("Universe0", imageLibrary, actionDefnsCommon, agentDefns, effectDefns, encounterDefns, itemDefns, encounter);
        return universe;
    } // end method
    universe_1_ItemDefns(categoriesByName) {
        var itemDefns = [
            // consumables
            new ItemDefn("Heal Potion", [categoriesByName.get("Consumable").name], (item, agent, target) => // apply
             {
                var items = agent.itemsInInventory;
                items.splice(items.indexOf(item), 1);
                target.integrity = Math.trimValueToMinAndMax(target.integrity + 20, 0, target.defn().integrityMax);
            }),
            new ItemDefn("Energy Potion", [categoriesByName.get("Consumable").name], (item, agent, target) => //apply
             {
                var items = agent.itemsInInventory;
                items.splice(items.indexOf(item), 1);
                target.energy =
                    (target.energy + 20).trimToRangeMax(target.defn().energyMax);
            }),
            // valuables
            new ItemDefn("Coin", [categoriesByName.get("Valuable").name], (item, agent, target) => // apply
             {
                // Do nothing.
            }),
            // weapons
            new ItemDefn("Club", [categoriesByName.get("Weapon").name], (item, agent, target) => // apply
             {
                target.integrity -= 5;
            }),
            new ItemDefn("Dagger", [categoriesByName.get("Weapon").name], (item, agent, target) => // apply
             {
                target.integrity -= 2;
            }),
            new ItemDefn("Mace", [categoriesByName.get("Weapon").name], (item, agent, target) => // apply
             {
                target.integrity -= 6;
            }),
            new ItemDefn("Sword", [categoriesByName.get("Weapon").name], (item, agent, target) => // apply
             {
                target.integrity -= 10;
            }),
        ];
        return itemDefns;
    }
    universe_2_ActionDefns() {
        var actionDefnsCommon = [
            new ActionDefn("Attack", true, // requiresTarget
            (encounter, agent, action) => // perform
             {
                var target = action.target();
                var displacementFromAgentToTarget = target.pos.clone().subtract(agent.pos);
                var distanceToTarget = displacementFromAgentToTarget.magnitude();
                var distanceToMovePerTick = 16;
                if (distanceToTarget > distanceToMovePerTick) {
                    var displacementToMove = displacementFromAgentToTarget.divideScalar(distanceToTarget).multiplyScalar(distanceToMovePerTick);
                    agent.pos.add(displacementToMove);
                }
                else {
                    var emptyToReturnTo = action.parameterByName("EmptyForPosToReturnTo");
                    if (target.integrity == null) {
                        agent.pos.overwriteWith(emptyToReturnTo.pos);
                        action.target_Set(null);
                        action.status = ActionStatus.Instances().Complete;
                    }
                    else {
                        var weaponEquipped = agent.itemsEquippedByName.get("Weapon");
                        if (weaponEquipped != null) {
                            weaponEquipped.apply(agent, target);
                        }
                        if (target.integrity <= 0) {
                            target.integrity = 0;
                            encounter.entitiesToRemove.push(target);
                        }
                        action.target_Set(emptyToReturnTo);
                    }
                }
            }, null // toMenu
            ),
            new ActionDefn("Defend", false, // requiresTarget
            (encounter, agent, action) => // perform
             {
                action.status = ActionStatus.Instances().Complete;
            }, null // toMenu
            ),
            new ActionDefn("Magic", true, // requiresTarget
            // updateEncounter
            (encounter, agent, action) => // perform
             {
                action.status = ActionStatus.Instances().Complete;
            }, 
            // toMenu
            () => {
                var universe = Globals.Instance.universe;
                var encounter = universe.encounter;
                var panesByName = encounter.defn().panesByName;
                var agent = encounter.agentCurrent;
                var spellDefns = agent.defn().spellDefns;
                var paneMenuPlayer = panesByName.get("Menu_Player");
                var returnMenu = new Menu("Magic", paneMenuPlayer.pos, // pos
                Coords.fromXY(0, 8), // spacing
                null, // menuable
                null, // updateEncounter
                Menu.menuablesToMenus(spellDefns, ["name"], // bindingPathsForMenuText
                (encounter) => {
                    var spellDefn = this.menuable;
                    var agent = encounter.agentCurrent;
                    var action = agent.action;
                    action.parameterByNameSet("SpellDefn", spellDefn);
                    action.defnName = "Spell";
                    action.status = ActionStatus.Instances().AwaitingTarget;
                }), 0 // indexOfChildSelected
                );
                return returnMenu;
            }),
            new ActionDefn("Spell", true, // requiresTarget
            (encounter, agent, action) => // perform
             {
                var target = action.target();
                var displacementFromAgentToTarget = target.pos.clone().subtract(agent.pos);
                var distanceToTarget = displacementFromAgentToTarget.magnitude();
                var distanceToMovePerTick = 16;
                if (distanceToTarget > distanceToMovePerTick) {
                    var displacementToMove = displacementFromAgentToTarget.divideScalar(distanceToTarget).multiplyScalar(distanceToMovePerTick);
                    agent.pos.add(displacementToMove);
                }
                else {
                    var emptyToReturnTo = action.parameterByName("EmptyForPosToReturnTo");
                    if (target.integrity == null) {
                        agent.pos.overwriteWith(emptyToReturnTo.pos);
                        action.target_Set(null);
                        action.status = ActionStatus.Instances().Complete;
                    }
                    else {
                        var spellDefn = action.parameterByName("SpellDefn");
                        spellDefn.apply(agent, target);
                        if (target.integrity <= 0) {
                            target.integrity = 0;
                            encounter.entitiesToRemove.push(target);
                        }
                        action.target_Set(emptyToReturnTo);
                    }
                }
            }, null // toMenu
            ),
            new ActionDefn("Item", false, // requiresTarget
            (encounter, agent, action) => // perform
             {
                action.status = ActionStatus.Instances().Complete;
            }, () => // perform
             {
                var universe = Globals.Instance.universe;
                var encounter = universe.encounter;
                var panesByName = encounter.defn().panesByName;
                var agent = encounter.agentCurrent;
                var items = agent.itemsInInventory;
                var returnMenu = new Menu("Items", panesByName.get("Menu_Player").pos, // pos
                Coords.fromXY(0, 8), // spacing
                null, // menuable
                (encounter, agent) => // updateEncounter
                 {
                    var action = agent.action;
                    action.status = ActionStatus.Instances().None;
                }, Menu.menuablesToMenus(items, ["defn().name"], // bindingPathsForMenuText
                (encounter) => {
                    var item = this.menuable;
                    var agent = encounter.agentCurrent;
                    var action = agent.action;
                    action.defnName = "ItemUse";
                    agent.itemsEquippedByName.set("ItemToUse", item);
                    action.status = ActionStatus.Instances().AwaitingTarget;
                }), 0 // indexOfChildSelected
                );
                return returnMenu;
            }),
            new ActionDefn("ItemUse", true, // requiresTarget
            (encounter, agent, action) => // perform
             {
                var target = action.target();
                var displacementFromAgentToTarget = target.pos.clone().subtract(agent.pos);
                var distanceToTarget = displacementFromAgentToTarget.magnitude();
                var distanceToMovePerTick = 16;
                if (distanceToTarget > distanceToMovePerTick) {
                    var displacementToMove = displacementFromAgentToTarget.divideScalar(distanceToTarget).multiplyScalar(distanceToMovePerTick);
                    agent.pos.add(displacementToMove);
                }
                else {
                    var emptyToReturnTo = action.parameterByName("EmptyForPosToReturnTo");
                    if (target.integrity == null) {
                        agent.pos.overwriteWith(emptyToReturnTo.pos);
                        action.target_Set(null);
                        action.status = ActionStatus.Instances().Complete;
                    }
                    else {
                        var itemEquipped = agent.itemsEquippedByName.get("ItemToUse");
                        if (itemEquipped != null) {
                            itemEquipped.apply(agent, target);
                        }
                        action.target_Set(emptyToReturnTo);
                    }
                }
            }, null // toMenu
            ),
            new ActionDefn("Wait", false, // requiresTarget
            (encounter, agent, action) => // perform
             {
                encounter.agentCurrentAdvance();
            }, null // toMenu
            ),
            new ActionDefn("Run", false, // requiresTarget
            (encounter, agent, action) => // perform
             {
                // todo
                action.status = ActionStatus.Instances().Complete;
            }, null // toMenu
            ),
        ];
        return actionDefnsCommon;
    }
    universe_3_AgentDefns(actionDefnsCommonByName) {
        var agentSizeInPixelsStandard = Coords.fromXY(24, 24);
        var visualAgentLabel = new VisualDynamic((universe, world, display, entity) => // draw
         {
            var agent = entity;
            var agentDefn = agent.defn();
            var agentText = "\n";
            if (agent.name != null) {
                agentText += agent.name + "\n";
            }
            agentText += agentDefn.name;
            var pos = agent.pos;
            display.drawText(agentText, display.fontHeightInPixels, pos, display.colorFore, display.colorBack);
        });
        var agentDefns = [
            new AgentDefn("Mage", new VisualGroup([
                new VisualFallthrough([
                    new VisualImageSlice("Agents", Coords.fromXY(0, 0).multiply(agentSizeInPixelsStandard), agentSizeInPixelsStandard),
                    new VisualRectangle(agentSizeInPixelsStandard, null, // colorFill
                    Color.byName("GrayLight")),
                ]),
                visualAgentLabel,
            ]), agentSizeInPixelsStandard, 10, //integrityMax,
            20, //energyMax,
            new Range2(1, 10), // initiativeRange
            //actionDefns
            [
                actionDefnsCommonByName.get("Attack"),
                actionDefnsCommonByName.get("Magic"),
                actionDefnsCommonByName.get("Item"),
                actionDefnsCommonByName.get("Wait"),
            ], 
            // spellDefns
            [
                new SpellDefn("Fire", (agent, target) => // apply
                 {
                    var energyNeeded = 5;
                    if (agent.energy > energyNeeded) {
                        agent.energy -= energyNeeded;
                        target.integrity -= 20;
                    }
                }),
            ]),
            new AgentDefn("Priest", new VisualGroup([
                new VisualFallthrough([
                    new VisualImageSlice("Agents", Coords.fromXY(1, 0).multiply(agentSizeInPixelsStandard), agentSizeInPixelsStandard),
                    new VisualRectangle(agentSizeInPixelsStandard, null, // colorFill
                    Color.byName("GrayLight")),
                ]),
                visualAgentLabel,
            ]), agentSizeInPixelsStandard, 20, //integrityMax,
            20, //energyMax,
            new Range2(1, 10), // initiativeRange
            //actionDefns
            [
                actionDefnsCommonByName.get("Attack"),
                actionDefnsCommonByName.get("Magic"),
                actionDefnsCommonByName.get("Item"),
                actionDefnsCommonByName.get("Wait"),
            ], 
            // spellDefns
            [
                new SpellDefn("Heal", (agent, target) => // apply
                 {
                    agent.energy =
                        (agent.energy + 5).trimToRangeMax(agent.defn().energyMax);
                    var integrityToHeal = 20;
                    target.integrity =
                        (target.integrity + integrityToHeal).trimToRangeMax(target.defn().integrityMax);
                }),
            ]),
            new AgentDefn("Rogue", new VisualGroup([
                new VisualFallthrough([
                    new VisualImageSlice("Agents", Coords.fromXY(3, 0).multiply(agentSizeInPixelsStandard), agentSizeInPixelsStandard),
                    new VisualRectangle(agentSizeInPixelsStandard, null, // colorFill
                    Color.byName("GrayLight")),
                ]),
                visualAgentLabel,
            ]), agentSizeInPixelsStandard, 20, //integrityMax,
            0, //energyMax,
            new Range2(5, 10), // initiativeRange
            //actionDefns
            [
                actionDefnsCommonByName.get("Attack"),
                actionDefnsCommonByName.get("Item"),
                actionDefnsCommonByName.get("Wait"),
            ], null // spellDefns
            ),
            new AgentDefn("Warrior", new VisualGroup([
                new VisualFallthrough([
                    new VisualImageSlice("Agents", Coords.fromXY(2, 0).multiply(agentSizeInPixelsStandard), agentSizeInPixelsStandard),
                    new VisualRectangle(agentSizeInPixelsStandard, null, // colorFill
                    Color.byName("GrayLight")),
                ]),
                visualAgentLabel,
            ]), agentSizeInPixelsStandard, 30, //integrityMax,
            0, //energyMax,
            new Range2(1, 10), // initiativeRange
            //actionDefns
            [
                actionDefnsCommonByName.get("Attack"),
                actionDefnsCommonByName.get("Item"),
                actionDefnsCommonByName.get("Wait"),
            ], null // spellDefns
            ),
            // non-players
            new AgentDefn("Goblin", new VisualGroup([
                new VisualFallthrough([
                    new VisualImage("Goblin"),
                    new VisualRectangle(Coords.fromXY(24, 24), null, // colorFill
                    Color.byName("Gray")),
                ]),
                visualAgentLabel,
            ]), Coords.fromXY(40, 40), // size
            8, //integrityMax,
            0, //energyMax,
            new Range2(1, 10), // initiativeRange
            //actionDefns
            [
                actionDefnsCommonByName.get("Attack"),
            ], null // spellDefns
            ),
            new AgentDefn("Troll", new VisualGroup([
                new VisualFallthrough([
                    new VisualImage("Troll"),
                    new VisualRectangle(Coords.fromXY(40, 40), null, // colorFill
                    Color.byName("GrayLight")),
                ]),
                visualAgentLabel,
            ]), Coords.fromXY(40, 40), // size
            50, //integrityMax,
            0, //energyMax,
            new Range2(1, 10), // initiativeRange
            //actionDefns
            [
                actionDefnsCommonByName.get("Attack"),
            ], null // spellDefns
            ),
        ];
        return agentDefns;
    }
    universe_4_Encounter(encounterDefnsByName, agentDefnsByName, itemDefnsByName) {
        var encounterDefnDefaultName = encounterDefnsByName.get("Default").name;
        var encounter = new Encounter(encounterDefnDefaultName, 
        // parties
        [
            new Party("Player", new IntelligenceHuman(), [
                new Agent("One", agentDefnsByName.get("Mage").name, Coords.fromXY(256, 20), 
                // itemsEquipped
                [
                    new Item(itemDefnsByName.get("Dagger").name)
                ], 
                // itemsInInventory
                [
                    new Item(itemDefnsByName.get("Energy Potion").name),
                    new Item(itemDefnsByName.get("Energy Potion").name),
                    new Item(itemDefnsByName.get("Energy Potion").name),
                ]),
                new Agent("Two", agentDefnsByName.get("Priest").name, Coords.fromXY(256, 50), 
                // itemsEquipped
                [
                    new Item(itemDefnsByName.get("Mace").name)
                ], [
                    new Item(itemDefnsByName.get("Heal Potion").name),
                    new Item(itemDefnsByName.get("Heal Potion").name),
                    new Item(itemDefnsByName.get("Heal Potion").name),
                ] // itemsInInventory
                ),
                new Agent("Three", agentDefnsByName.get("Warrior").name, Coords.fromXY(256, 80), 
                // itemsEquipped
                [
                    new Item(itemDefnsByName.get("Sword").name)
                ], [] // itemsInInventory
                ),
                new Agent("Four", agentDefnsByName.get("Rogue").name, Coords.fromXY(256, 110), 
                // itemsEquipped
                [
                    new Item(itemDefnsByName.get("Dagger").name)
                ], [] // itemsInInventory
                ),
            ]),
            new Party("Other", new IntelligenceMachine(), [
                new Agent(null, // name
                agentDefnsByName.get("Troll").name, Coords.fromXY(90, 20), [new Item(itemDefnsByName.get("Club").name)], // itemsEquipped
                [new Item(itemDefnsByName.get("Coin").name, 5)] // itemsInInventory
                ),
                new Agent(null, // name
                agentDefnsByName.get("Goblin").name, Coords.fromXY(30, 50), [new Item(itemDefnsByName.get("Dagger").name)], // itemsEquipped
                [new Item(itemDefnsByName.get("Coin").name, 1)] // itemsInInventory
                ),
                new Agent(null, // name
                agentDefnsByName.get("Goblin").name, Coords.fromXY(90, 80), [new Item(itemDefnsByName.get("Dagger").name)], // itemsEquipped
                [new Item(itemDefnsByName.get("Coin").name, 1)] // itemsInInventory
                ),
                new Agent(null, // name
                agentDefnsByName.get("Goblin").name, Coords.fromXY(150, 50), [new Item(itemDefnsByName.get("Dagger").name)], // itemsEquipped
                [new Item(itemDefnsByName.get("Coin").name, 1)]),
            ]),
        ]);
        return encounter;
    }
}
