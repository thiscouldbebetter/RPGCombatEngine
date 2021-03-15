
class VisualDynamic
{
	constructor(draw)
	{
		this._draw = draw;
	}

	draw(universe, world, display, entity)
	{
		this._draw.call(this, universe, world, display, entity);
	}
}
