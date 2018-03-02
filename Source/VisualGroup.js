
function VisualGroup(children)
{
	this.children = children;
}

{
	VisualGroup.prototype.drawToDisplayForDrawable = function
	(
		display, drawable
	)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.drawToDisplayForDrawable(display, drawable);
		}
	}
}
