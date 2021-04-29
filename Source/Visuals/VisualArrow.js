"use strict";
class VisualArrow {
    constructor() {
        this._size = Coords.fromXY(1, 1).multiplyScalar(8); // hack
    }
    draw(universe, world, display, entity) {
        var pos = entity.pos;
        var size = this._size;
        var vertices = [
            new Coords(pos.x, pos.y + size.y / 2),
            new Coords(pos.x - size.x, pos.y),
            new Coords(pos.x - size.x, pos.y + size.y)
        ];
        display.drawPolygon(vertices, null, display.colorFore);
    }
    ;
}
