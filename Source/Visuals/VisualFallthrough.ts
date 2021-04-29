
class VisualFallthrough
{
	children: any[];

	constructor(children: any[])
	{
		this.children = children;
	}

	draw
	(
		universe: Universe, world: World, display: Display, entity: Entity
	): void
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			try
			{
				child.draw(universe, world, display, entity);
				break;
			}
			catch (err)
			{
				// Do nothing.
				throw err;
			}
		}
	};

}
