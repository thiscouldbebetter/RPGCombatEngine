"use strict";
class Globals {
    handleEventTimerTick() {
        this.universe.updateForTimerTick();
    }
    initialize(millisecondsPerTimerTick, display, universe) {
        this.display = display;
        this.display.initialize();
        this.universe = universe;
        this.universe.initialize();
        this.inputHelper = new InputHelper();
        this.inputHelper.initialize();
        this.timer = setInterval(this.handleEventTimerTick.bind(this), millisecondsPerTimerTick);
    }
}
Globals.Instance = new Globals();
