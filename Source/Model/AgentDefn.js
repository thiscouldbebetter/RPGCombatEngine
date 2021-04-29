"use strict";
class AgentDefn {
    constructor(name, visual, sizeInPixels, integrityMax, energyMax, initiativeRange, actionDefns, spellDefns) {
        this.name = name;
        this.visual = visual;
        this.sizeInPixels = sizeInPixels;
        this.integrityMax = integrityMax;
        this.energyMax = energyMax;
        this.initiativeRange = initiativeRange;
        this.actionDefns = actionDefns;
        this.spellDefns = spellDefns || [];
        this.actionDefnsByName = ArrayHelper.addLookupsByName(this.actionDefns);
        this.spellDefnsByName = ArrayHelper.addLookupsByName(this.spellDefns);
    }
}
