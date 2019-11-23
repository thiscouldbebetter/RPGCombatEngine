

function Globals()
{}
{
	Globals.Instance = new Globals();

	Globals.prototype.handleEventTimerTick = function()
	{
		this.universe.updateForTimerTick();
	}

	Globals.prototype.initialize = function
	(
		millisecondsPerTimerTick,
		display,
		universe
	)
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
