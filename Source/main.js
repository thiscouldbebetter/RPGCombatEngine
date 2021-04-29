"use strict";
function main() {
    var universe = new DemoData().universe();
    var display = new Display2D([Coords.fromXY(300, 225)], "Font", // fontName
    8, // fontHeightInPixels
    Color.byName("GrayLight"), // colorFore
    Color.byName("Black") // colorBack
    );
    Globals.Instance.initialize(100, // millisecondsPerTimerTick
    display, universe);
}
