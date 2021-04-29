"use strict";
class Effect {
    constructor(defnName, turnApplied) {
        this.defnName = defnName;
        this.turnApplied = turnApplied;
    }
    defn() {
        return Globals.Instance.universe.effectDefnsByName.get(this.defnName);
    }
}
