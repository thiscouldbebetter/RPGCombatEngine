
class Pane
{
	name: string;
	pos: Coords;
	size: Coords;

	constructor(name: string, pos: Coords, size: Coords)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
	}

	// drawable

	draw(universe: Universe, world: World, display: Display): void
	{
		display.drawRectangle
		(
			this.pos, this.size, 
			display.colorBack, 
			display.colorFore
		);
	}
}
