
function VisualText(text, colorFill)
{
	this.text = text;
	this.colorFill = colorFill;
}

{
	VisualText.prototype.drawToDisplayForDrawable = function(display, drawable)
	{
		display.drawText
		(
			this.text,
			pos,
			this.colorFill
		);
	}
}
