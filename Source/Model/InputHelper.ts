
class InputHelper
{
	keyPressed: string;
	hasKeyPressedBeenProcessed: boolean;

	constructor()
	{
		this.keyPressed = null;
		this.hasKeyPressedBeenProcessed = false;
	}

	initialize()
	{
		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
	}

	// events

	handleEventKeyDown(event)
	{
		var key = event.key;
		this.keyPressed = key;
		if (this.keyPressed != key)
		{
			this.keyPressed = key;
			this.hasKeyPressedBeenProcessed = false;
		}
	}

	handleEventKeyUp(e)
	{
		this.keyPressed = null;
		this.hasKeyPressedBeenProcessed = false;
	}
}
