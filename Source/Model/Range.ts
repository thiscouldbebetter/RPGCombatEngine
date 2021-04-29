
class Range2
{
	min: number;
	max: number;
	size: number;

	constructor(min: number, max: number)
	{
		this.min = min;
		this.max = max;
		this.size = this.max - this.min;
	}

	randomNumberInRange()
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
