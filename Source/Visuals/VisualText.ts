
class VisualText
{
	text: string;
	colorFill: Color;

	constructor(text: string, colorFill: Color)
	{
		this.text = text;
		this.colorFill = colorFill;
	}

	draw
	(
		universe: Universe, world: World, display: Display, entity: Entity
	): void
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
