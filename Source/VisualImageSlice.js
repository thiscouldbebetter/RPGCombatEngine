
function VisualImageSlice(imageName, offset, size)
{
	this.imageName = imageName;
	this.offset = offset;
	this.size = size;

	this._sliceBox = new Box().fromMinAndSize(offset, size);
}

{
	VisualImageSlice.prototype.draw = function
	(
		universe, world, display, entity
	)
	{
		var imageLibrary = universe.imageLibrary;
		var image = imageLibrary.images[this.imageName];
		var pos = entity.pos;
		display.drawImagePartial
		(
			image, pos, this._sliceBox
		);
	}
}
