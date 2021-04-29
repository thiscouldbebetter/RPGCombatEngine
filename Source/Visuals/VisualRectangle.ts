
class VisualRectangle
{
	size: Coords;
	colorFill: Color;
	colorBorder: Color;

	constructor(size, colorFill, colorBorder)
	{
		this.size = size;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw
	(
		universe: Universe, world: World, display: Display, entity: Entity
	): void
	{
		var pos = entity.pos;
		display.drawRectangle
		(
			pos, this.size, 
			this.colorFill, this.colorBorder
		);
	}
}
