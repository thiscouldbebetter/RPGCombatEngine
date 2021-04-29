"use strict";
class Agent {
    constructor(name, defnName, pos, itemsEquipped, itemsInInventory) {
        this.name = name;
        this.defnName = defnName;
        this.pos = pos;
        this.itemsEquipped = itemsEquipped || [];
        this.itemsInInventory = itemsInInventory || [];
        this.itemsEquippedByName =
            ArrayHelper.addLookupsByName(this.itemsEquipped);
        this.action = null;
        this.effects = [];
        this.hasMovedThisTurn = false;
        this._visualArrow = new VisualArrow();
    }
    defn() {
        return Globals.Instance.universe.agentDefnsByName.get(this.defnName);
    }
    initializeForEncounter(encounter) {
        var defn = this.defn();
        this.integrity = defn.integrityMax;
        this.energy = defn.energyMax;
        this.hasMovedThisTurn = false;
        if (this.itemsEquipped != null) {
            for (var i = 0; i < this.itemsEquipped.length; i++) {
                var item = this.itemsEquipped[i];
                var itemDefn = item.defn();
                var categoryNames = itemDefn.categoryNames;
                for (var c = 0; c < categoryNames.length; c++) {
                    var categoryName = categoryNames[c];
                    this.itemsEquippedByName.set(categoryName, item);
                }
            }
        }
    }
    updateEncounterForTimerTick(encounter) {
        if (encounter.agentCurrent == this) {
            if (this.action == null) {
                this.action = new Action(ActionStatus.Instances().None);
            }
            this.action.updateEncounterAndAgentForTimerTick(encounter, this);
        }
    }
    // menuable
    toMenu() {
        var universe = Globals.Instance.universe;
        var encounter = universe.encounter;
        var panesByName = encounter.defn().panesByName;
        var agentDefn = this.defn();
        var spellDefns = agentDefn.spellDefns;
        var textForAgent;
        if (this.name == null) // hack
         {
            textForAgent = agentDefn.name;
        }
        else {
            textForAgent = this.name;
        }
        textForAgent +=
            " ("
                + "H:" + this.integrity + "/" + agentDefn.integrityMax;
        if (agentDefn.energyMax > 0) {
            textForAgent +=
                " E:" + this.energy + "/" + agentDefn.energyMax;
        }
        textForAgent += ")";
        var returnMenu = new Menu(textForAgent, panesByName.get("Menu_Player").pos, // pos
        new Coords(0, 8), // spacing
        this, // menuable
        null, // updateEncounter
        null, // children
        0 // indexOfChildSelected
        );
        return returnMenu;
    }
    // drawable
    draw(universe, world, display) {
        var agentDefn = this.defn();
        agentDefn.visual.draw(universe, world, display, this);
        var encounter = universe.encounter;
        var agentCurrent = encounter.agentCurrent;
        if (this == agentCurrent) {
            this._visualArrow.draw(universe, world, display, this);
            var action = this.action;
            if (action != null) {
                var actionTarget = action.target();
                if (actionTarget != null) {
                    this._visualArrow.draw(universe, world, display, actionTarget);
                }
            }
        }
    }
}
