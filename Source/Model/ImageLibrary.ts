
class ImageLibrary
{
	images: Image3[];
	imagesByName: Map<string, Image3>;

	constructor(images: Image3[])
	{
		this.images = images;
		this.imagesByName =
			ArrayHelper.addLookupsByName(this.images);
	}

	imageByName(imageName: string): Image3
	{
		return this.imagesByName.get(imageName);
	}
}
