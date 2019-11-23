
function InputHelper()
{
	this.keyPressed = null;
	this.hasKeyPressedBeenProcessed = false;
}
{
	InputHelper.prototype.initialize = function()
	{
		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
	}

	// events

	InputHelper.prototype.handleEventKeyDown = function(event)
	{
		var key = event.key;
		this.keyPressed = key;
		if (this.keyPressed != key)
		{
			this.keyPressed = key;
			this.hasKeyPressedBeenProcessed = false;
		}
	}

	InputHelper.prototype.handleEventKeyUp = function(e)
	{
		this.keyPressed = null;
		this.hasKeyPressedBeenProcessed = false;
	}
}
