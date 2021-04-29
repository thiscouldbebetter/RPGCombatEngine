"use strict";
class Pane {
    constructor(name, pos, size) {
        this.name = name;
        this.pos = pos;
        this.size = size;
    }
    // drawable
    draw(universe, world, display) {
        display.drawRectangle(this.pos, this.size, display.colorBack, display.colorFore);
    }
}
