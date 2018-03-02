
function NumberHelper()
{
	// static class
}

{
	NumberHelper.trimValueToMinAndMax = function(value, min, max)
	{
		if (value < min)
		{
			value = min;
		}
		else if (value > max)
		{
			value = max;
		}

		return value;
	}
}
