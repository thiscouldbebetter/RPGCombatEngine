
function ActionStatus(name)
{
	this.name = name;
}

{
	ActionStatus.Instances = new ActionStatus_Instances();
	
	function ActionStatus_Instances()
	{
		this.None 		= new ActionStatus("None");
		this.AwaitingActionDefn = new ActionStatus("AwaitingActionDefn");
		this.AwaitingTarget 	= new ActionStatus("AwaitingTarget");
		this.Running 		= new ActionStatus("Running");
		this.Complete 		= new ActionStatus("Complete"); 
	}
}
