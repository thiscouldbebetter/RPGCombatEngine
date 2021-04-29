"use strict";
class Item {
    constructor(defnName, quantity) {
        this.defnName = defnName;
        this.quantity = (quantity == null ? 1 : quantity);
    }
    apply(agent, target) {
        this.defn().apply(this, agent, target);
    }
    defn() {
        return Globals.Instance.universe.itemDefnsByName.get(this.defnName);
    }
}
