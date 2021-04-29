
class VisualDynamic
{
	draw: any;

	constructor(draw)
	{
		this._draw = draw;
	}

	draw
	(
		universe: Universe, world: World, display: Display, entity: Entity
	): void
	{
		this._draw.call(this, universe, world, display, entity);
	}
}
