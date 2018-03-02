

function VisualRectangle(size, colorFill, colorBorder)
{
	this.size = size;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
}

{
	VisualRectangle.prototype.drawToDisplayForDrawable = function
	(
		display, drawable
	)
	{
		display.drawRectangle
		(
			drawable.pos, this.size, 
			this.colorFill, this.colorBorder
		);
	}
}
