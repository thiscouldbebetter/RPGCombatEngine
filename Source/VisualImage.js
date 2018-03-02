
function VisualImage(imageName)
{
	this.imageName = imageName;
}

{
	VisualImage.prototype.drawToDisplayForDrawable = function
	(
		display, drawable
	)
	{
		var imageLibrary = Globals.Instance.universe.imageLibrary;
		var image = imageLibrary.images[this.imageName];
		display.drawImage(image.systemImage, drawable.pos);
	}
}
