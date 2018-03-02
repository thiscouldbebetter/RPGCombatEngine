
function Pane(name, pos, size)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
}

{
	// drawable

	Pane.prototype.drawToDisplay = function(display)
	{
		display.drawRectangle
		(
			this.pos, this.size, 
			display.colorBack, 
			display.colorFore
		);
	}
}
