
class VisualImage
{
	imageName: string;

	constructor(imageName)
	{
		this.imageName = imageName;
	}

	draw
	(
		universe: Universe, world: World, display: Display, entity: Entity
	): void
	{
		var imageLibrary = universe.imageLibrary;
		var image = imageLibrary.imageByName(this.imageName);
		var pos = entity.pos;
		display.drawImage(image, pos);
	}
}
