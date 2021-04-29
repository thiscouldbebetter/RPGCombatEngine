"use strict";
class VisualImageSlice {
    constructor(imageName, offset, size) {
        this.imageName = imageName;
        this.offset = offset;
        this.size = size;
        this._sliceBox = Box.fromMinAndSize(offset, size);
    }
    draw(universe, world, display, entity) {
        var imageLibrary = universe.imageLibrary;
        var image = imageLibrary.imageByName(this.imageName);
        var pos = entity.pos;
        display.drawImagePartial(image, pos, this._sliceBox);
    }
}
