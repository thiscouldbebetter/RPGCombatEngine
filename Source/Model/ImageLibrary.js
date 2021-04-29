"use strict";
class ImageLibrary {
    constructor(images) {
        this.images = images;
        this.imagesByName =
            ArrayHelper.addLookupsByName(this.images);
    }
    imageByName(imageName) {
        return this.imagesByName.get(imageName);
    }
}
