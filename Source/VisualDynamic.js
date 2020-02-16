
function VisualDynamic(draw)
{
	this._draw = draw;
}

{
	VisualDynamic.prototype.draw = function
	(
		universe, world, display, entity
	)
	{
		this._draw.call(this, universe, world, display, entity);
	}
}
