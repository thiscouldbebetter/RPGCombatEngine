"use strict";
class VisualText {
    constructor(text, colorFill) {
        this.text = text;
        this.colorFill = colorFill;
    }
    draw(universe, world, display, entity) {
        var pos = entity.pos;
        display.drawText(this.text, display.fontHeightInPixels, pos, this.colorFill);
    }
}
