
function VisualImage(imageName)
{
	this.imageName = imageName;
}

{
	VisualImage.prototype.draw = function
	(
		universe, world, display, entity
	)
	{
		var imageLibrary = universe.imageLibrary;
		var image = imageLibrary.images[this.imageName];
		var pos = entity.pos;
		display.drawImage(image, pos);
	};
}
