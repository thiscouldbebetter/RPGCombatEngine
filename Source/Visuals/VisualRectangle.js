"use strict";
class VisualRectangle {
    constructor(size, colorFill, colorBorder) {
        this.size = size;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
    }
    draw(universe, world, display, entity) {
        var pos = entity.pos;
        display.drawRectangle(pos, this.size, this.colorFill, this.colorBorder);
    }
}
