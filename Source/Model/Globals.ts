
class Globals
{
	static Instance = new Globals();

	display: Display;
	universe: Universe;
	inputHelper: InputHelper;
	timer: any;

	handleEventTimerTick(): void
	{
		this.universe.updateForTimerTick();
	}

	initialize
	(
		millisecondsPerTimerTick: number, display: Display, universe: Universe
	): void
	{
		this.display = display;
		this.display.initialize();

		this.universe = universe;
		this.universe.initialize();

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize();

		this.timer = setInterval
		(
			this.handleEventTimerTick.bind(this),
			millisecondsPerTimerTick
		);
	}
}
