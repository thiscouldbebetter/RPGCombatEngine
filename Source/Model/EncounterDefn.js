"use strict";
class EncounterDefn {
    constructor(name, panes) {
        this.name = name;
        this.panes = panes;
        this.panesByName = ArrayHelper.addLookupsByName(this.panes);
    }
}
