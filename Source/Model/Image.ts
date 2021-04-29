
class Image3
{
	name: string;
	sourcePath: string;

	systemImage: any;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.systemImage = document.createElement("img");
		this.systemImage.src = this.sourcePath;
	}
}
