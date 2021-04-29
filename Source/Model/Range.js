"use strict";
class Range2 {
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.size = this.max - this.min;
    }
    randomNumberInRange() {
        return;
        this.min
            + Math.floor(Math.random()
                * this.size);
    }
}
