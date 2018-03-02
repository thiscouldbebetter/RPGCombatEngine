
function Display(sizeInPixels, fontHeightInPixels, colorFore, colorBack)
{
	this.sizeInPixels = sizeInPixels;
	this.fontHeightInPixels = fontHeightInPixels;
	this.colorFore = colorFore;
	this.colorBack = colorBack;
}

{
	Display.prototype.clear = function()
	{
		this.drawRectangle
		(
			Coords.Instances.Zeroes, this.sizeInPixels,
			this.colorBack, this.colorFore
		);
	}

	Display.prototype.drawArrow = function(pos, size)
	{
		this.graphics.strokeStyle = this.colorFore;
		this.graphics.beginPath();
		this.graphics.moveTo(pos.x, pos.y + size.y / 2);
		this.graphics.lineTo(pos.x - size.x, pos.y);
		this.graphics.lineTo(pos.x - size.x, pos.y + size.y);
		this.graphics.closePath();
		this.graphics.stroke();
	}

	Display.prototype.drawImage = function(systemImage, pos, size)
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

	Display.prototype.drawImageSlice = function
	(
		systemImage, sliceOffset, sliceSize, drawPos, drawSize
	)
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



	Display.prototype.drawRectangle = function(pos, size, colorFill, colorBorder)
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

	Display.prototype.drawText = function(textToDraw, pos, colorFill, colorBorder)
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

	Display.prototype.initialize = function()
	{
		var canvas = document.createElement("canvas");
		canvas.width = this.sizeInPixels.x;
		canvas.height = this.sizeInPixels.y;
		this.graphics = canvas.getContext("2d");
		this.graphics.font = "" + this.fontHeightInPixels + "px sans-serif";

		document.body.appendChild(canvas);
	}
}
