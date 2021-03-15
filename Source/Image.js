
class Image
{
	constructor(name, sourcePath)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.systemImage = document.createElement("img");
		this.systemImage.src = this.sourcePath;
	}
}
