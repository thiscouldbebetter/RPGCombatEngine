function main()
{
	var universe = new DemoData().universe();

	Globals.Instance.initialize
	(
		100, // millisecondsPerTimerTick
		new Display
		(
			new Coords(300, 225),
			8, // fontHeightInPixels
			"LightGray", // colorFore
			"Black" // colorBack
		),
		universe
	);
}
