
function main()
{
	var universe = new DemoData().universe();

	var display = new Display2D
	(
		[ new Coords(300, 225) ],
		"Font", // fontName
		8, // fontHeightInPixels
		"LightGray", // colorFore
		"Black" // colorBack
	);

	Globals.Instance.initialize
	(
		100, // millisecondsPerTimerTick
		display,
		universe
	);
}
