
function VisualText(text, colorFill)
{
	this.text = text;
	this.colorFill = colorFill;
}

{
	VisualText.prototype.draw = function(universe, world, display, entity)
	{
		var pos = entity.pos;
		display.drawText
		(
			this.text,
			display.fontHeightInPixels,
			pos,
			this.colorFill
		);
	}
}
