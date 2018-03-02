
function Range(min, max)
{
	this.min = min;
	this.max = max;
	this.size = this.max - this.min;
}

{
	Range.prototype.randomNumberInRange = function()
	{
		return
			this.min 
			+ Math.floor
			(
				Math.random()
				* this.size
			);
	}
}
