
function VisualImageSlice(imageName, offset, size)
{
	this.imageName = imageName;
	this.offset = offset;
	this.size = size;
}

{
	VisualImageSlice.prototype.drawToDisplayForDrawable = function
	(
		display, drawable
	)
	{
		var imageLibrary = Globals.Instance.universe.imageLibrary;
		var image = imageLibrary.images[this.imageName];
		display.drawImageSlice
		(
			image.systemImage, this.offset, this.size, drawable.pos
		);
	}
}
