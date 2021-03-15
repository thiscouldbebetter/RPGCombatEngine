
class VisualGroup
{
	constructor(children)
	{
		this.children = children;
	}

	draw(universe, world, display, entity)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.draw(universe, world, display, entity);
		}
	}
}
