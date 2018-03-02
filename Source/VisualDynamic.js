
function VisualDynamic(drawToDisplayForDrawable)
{
	this.drawToDisplayForDrawable = drawToDisplayForDrawable;
}

{
	VisualDynamic.prototype.drawToDisplayForDrawable = function
	(
		display, drawable
	)
	{
		this.drawToDisplayForDrawable.call(this, display, drawable);
	}
}
