"use strict";
class Universe {
    constructor(name, imageLibrary, actionDefns, agentDefns, effectDefns, encounterDefns, itemDefns, encounter) {
        this.name = name;
        this.imageLibrary = imageLibrary;
        this.actionDefns = actionDefns;
        this.agentDefns = agentDefns;
        this.effectDefns = effectDefns;
        this.encounterDefns = encounterDefns;
        this.itemDefns = itemDefns;
        this.encounter = encounter;
        this.agentDefnsByName = ArrayHelper.addLookupsByName(this.agentDefns);
        this.effectDefnsByName = ArrayHelper.addLookupsByName(this.effectDefns);
        this.encounterDefnsByName = ArrayHelper.addLookupsByName(this.encounterDefns);
        this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);
    }
    initialize() {
        this.encounter.initialize();
    }
    updateForTimerTick() {
        this.encounter.updateForTimerTick(this, null);
    }
}
