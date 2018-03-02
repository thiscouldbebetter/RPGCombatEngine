
function VisualFallthrough(children)
{
	this.children = children;	
}

{
	VisualFallthrough.prototype.drawToDisplayForDrawable = function
	(
		display, drawable
	)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			try
			{
				child.drawToDisplayForDrawable(display, drawable);
				break;
			}
			catch (err)
			{
				// do nothing
				var todo = 1;
			}
		}
	}

}
