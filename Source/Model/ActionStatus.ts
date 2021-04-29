
class ActionStatus
{
	name: string;

	constructor(name)
	{
		this.name = name;
	}

	static Instances()
	{
		if (ActionStatus._instances == null)
		{
			ActionStatus._instances = new ActionStatus_Instances();
		}
		return ActionStatus._instances;
	}
}

class ActionStatus_Instances
{
	None: ActionStatus;
	AwaitingActionDefn: ActionStatus;
	Awaiting: ActionStatus;
	Running: ActionStatus;
	Complete: ActionStatus;

	constructor()
	{
		this.None 				= new ActionStatus("None");
		this.AwaitingActionDefn = new ActionStatus("AwaitingActionDefn");
		this.AwaitingTarget 	= new ActionStatus("AwaitingTarget");
		this.Running 			= new ActionStatus("Running");
		this.Complete 			= new ActionStatus("Complete"); 
	}
}

