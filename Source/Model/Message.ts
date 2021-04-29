
class Message
{
	text: string;
	pos: Coords;

	ticksToLive: number;

	constructor(text: string, pos: Coords)
	{
		this.text = text;
		this.pos = pos;

		this.ticksToLive = 100;
	}
}
