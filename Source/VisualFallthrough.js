
function VisualFallthrough(children)
{
	this.children = children;
}

{
	VisualFallthrough.prototype.draw = function(universe, world, display, entity)
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
