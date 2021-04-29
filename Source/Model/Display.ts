
class Display
{
	sizeInPixels: Coords;
	fontHeightInPixels: number;
	colorFore: Color;
	colorBack: Color;

	constructor
	(
		sizeInPixels: Coords, fontHeightInPixels: number,
		colorFore: Color, colorBack: Color
	)
	{
		this.sizeInPixels = sizeInPixels;
		this.fontHeightInPixels = fontHeightInPixels;
		this.colorFore = colorFore;
		this.colorBack = colorBack;
	}

	clear()
	{
		this.drawRectangle
		(
			Coords.Instances().Zeroes, this.sizeInPixels,
			this.colorBack, this.colorFore
		);
	}

	drawArrow(pos: Coords): void
	{
		var size = Coords.fromXY(1, 1).multiplyScalar(8);

		this.graphics.strokeStyle = this.colorFore;
		this.graphics.beginPath();
		this.graphics.moveTo(pos.x, pos.y + size.y / 2);
		this.graphics.lineTo(pos.x - size.x, pos.y);
		this.graphics.lineTo(pos.x - size.x, pos.y + size.y);
		this.graphics.closePath();
		this.graphics.stroke();
	}

	drawImage(systemImage: any, pos: Coords, size: Coords): void
	{
		if (size == null)
		{
			this.graphics.drawImage
			(
				systemImage,
				pos.x, pos.y
			);
		}
		else
		{
			this.graphics.drawImage
			(
				systemImage,
				pos.x, pos.y,
				size.x, size.y
			);
		}
	}

	drawImageSlice
	(
		systemImage: any, sliceOffset: Coords, sliceSize: Coords,
		drawPos: Coords, drawSize: Coords
	): void
	{
		if (drawSize == null)
		{
			this.graphics.drawImage
			(
				systemImage,
				sliceOffset.x, sliceOffset.y,
				sliceSize.x, sliceSize.y,
				drawPos.x, drawPos.y,
				sliceSize.x, sliceSize.y // drawSize
			);
		}
		else
		{
			this.graphics.drawImage
			(
				systemImage,
				sliceOffset.x, sliceOffset.y,
				sliceSize.x, sliceSize.y,
				drawPos.x, drawPos.y,
				drawSize.x, drawSize.y
			);
		}
	}

	drawRectangle
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void
	{
		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fillRect
			(
				pos.x, pos.y, size.x, size.y
			);
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.strokeRect
			(
				pos.x, pos.y, size.x, size.y
			);
		}
	}

	drawText
	(
		textToDraw: string, pos: Coords, colorFill: Color, colorBorder: Color
	): void
	{
		var textToDrawAsLines = textToDraw.split("\n");

		if (colorFill == null)
		{
			colorFill = this.colorFore;
		}
		this.graphics.fillStyle = colorFill;

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
		}

		for (var i = 0; i < textToDrawAsLines.length; i++)
		{
			var textLine = textToDrawAsLines[i];

			if (colorBorder != null)
			{
				this.graphics.strokeText
				(
					textLine,
					pos.x + 2, // hack
					pos.y + this.fontHeightInPixels * (i + 1)
				);
			}

			this.graphics.fillText
			(
				textLine,
				pos.x + 2, // hack
				pos.y + this.fontHeightInPixels * (i + 1)
			);
		}
	}

	initialize()
	{
		var canvas = document.createElement("canvas");
		canvas.width = this.sizeInPixels.x;
		canvas.height = this.sizeInPixels.y;
		this.graphics = canvas.getContext("2d");
		this.graphics.font = "" + this.fontHeightInPixels + "px sans-serif";

		document.body.appendChild(canvas);
	}
}
