"use strict";
class VisualImage {
    constructor(imageName) {
        this.imageName = imageName;
    }
    draw(universe, world, display, entity) {
        var imageLibrary = universe.imageLibrary;
        var image = imageLibrary.imageByName(this.imageName);
        var pos = entity.pos;
        display.drawImage(image, pos);
    }
}
