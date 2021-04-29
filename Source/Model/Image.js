"use strict";
class Image3 {
    constructor(name, sourcePath) {
        this.name = name;
        this.sourcePath = sourcePath;
        this.systemImage = document.createElement("img");
        this.systemImage.src = this.sourcePath;
    }
}
