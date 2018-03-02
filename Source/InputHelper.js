
function InputHelper()
{}
{
	InputHelper.prototype.initialize = function()
	{
		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
	}

	InputHelper.prototype.updateForTimerTick = function()
	{
		this.keyPressed = null;
	}

	// events

	InputHelper.prototype.handleEventKeyDown = function(e)
	{
		this.keyPressed = e.key;
	}

	InputHelper.prototype.handleEventKeyUp = function(e)
	{
		// todo 
	}
}
