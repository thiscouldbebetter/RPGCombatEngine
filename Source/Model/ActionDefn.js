"use strict";
class ActionDefn {
    constructor(name, requiresTarget, perform, toMenu) {
        this.name = name;
        this.requiresTarget = requiresTarget;
        this.perform = perform;
        this.toMenu = toMenu;
    }
}
