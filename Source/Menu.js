
function Menu
(
	text, 
	pos, 
	spacing, 
	menuable,
	updateEncounter, 
	children, 
	indexOfChildSelected
)
{
	this.text = text;
	this.pos = pos;
	this.spacing = spacing;
	this.menuable = menuable;
	this.updateEncounter = updateEncounter;
	this.children = children;
	this.indexOfChildSelected = indexOfChildSelected;
}

{
	Menu.menuablesToMenus = function(menuables, bindingPathsForMenuText, updateEncounter)
	{
		var returnValues = [];

		for (var i = 0; i < menuables.length; i++)
		{
			var menuable = menuables[i];

			var menuableAsMenu;

			if (menuable.toMenu != null)
			{
				menuableAsMenu = menuable.toMenu();
			}
			else
			{
				var menuText = "";
				for (var f = 0; f < bindingPathsForMenuText.length; f++)
				{
					var bindingPathForMenuText = bindingPathsForMenuText[f];
					var bindingPathElements = bindingPathForMenuText.split(".");
	
					var valueCurrent = menuable;
					for (var g = 0; g < bindingPathElements.length; g++)
					{
						var bindingPathElement = bindingPathElements[g];
	
						if (bindingPathElement.indexOf("()") == -1)
						{
							valueCurrent = valueCurrent[bindingPathElement];
						}
						else
						{
							bindingPathElement = bindingPathElement.substr(0, bindingPathElement.length - "()".length);
							var method = valueCurrent[bindingPathElement];
							valueCurrent = method.call(valueCurrent);
						}
					}
	
					menuText += valueCurrent;
				}
	
				menuableAsMenu = new Menu
				(
					menuText,
					new Coords(0, 0), // pos
					new Coords(0, 8), // spacing
					menuable, // menuable
					updateEncounter,
					null // children
				);
			}
			
			

			returnValues.push(menuableAsMenu);
		}

		return returnValues;
	}

	// instance methods

	Menu.prototype.childSelected = function()
	{
		return (this.indexOfChildSelected == null ? null : this.children[this.indexOfChildSelected]);
	}

	Menu.prototype.indexOfChildSelectedAdd = function(valueToAdd)
	{
		this.indexOfChildSelected += valueToAdd;
		if (this.indexOfChildSelected < 0)
		{
			this.indexOfChildSelected = this.children.length - 1;
		}
		else if (this.indexOfChildSelected >= this.children.length)
		{
			this.indexOfChildSelected = 0;
		}
	}

	Menu.prototype.updateEncounterForTimerTick = function(encounter)
	{
		if (this.isLocked == true)
		{
			return;
		}

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.hasKeyPressedBeenProcessed == false)
		{
			var keyPressed = inputHelper.keyPressed;

			if (keyPressed == "ArrowLeft")
			{
				// todo - back
			}
			else if (keyPressed == "Enter" || keyPressed == "ArrowRight") 
			{
				inputHelper.hasKeyPressedBeenProcessed = true;
				
				var encounter = Globals.Instance.universe.encounter;
				var childSelected = this.childSelected();

				this.isLocked = true;

				encounter.entitiesToRemove.push(this);
				var hasNoChildren =
					(childSelected.children == null || childSelected.children.length == 0);
				if (hasNoChildren)
				{
					childSelected.updateEncounter(encounter);
				}
				else
				{
					encounter.entitiesToSpawn.push(childSelected);
				}
			}
			else if (keyPressed == "ArrowDown")
			{
				this.indexOfChildSelectedAdd(1);
			}
			else if (keyPressed == "ArrowUp")
			{
				this.indexOfChildSelectedAdd(-1);
			}
		}
	}

	// drawable

	Menu.prototype.drawToDisplay = function(display)
	{
		var menu = this;
		var pos = menu.pos;
		var spacing = menu.spacing;

		var arrowSize = new Coords(8, 8);
		var drawPos = pos.clone().add
		(
			new Coords(arrowSize.x + 2, spacing.y / 2)
		);

		var children = menu.children;

		if (children != null)
		{
			for (var i = 0; i < children.length; i++)
			{
				var child = children[i];
				var displayText = child.text;
				display.drawText
				(
					displayText,
					drawPos
				);

				drawPos.y += arrowSize.y / 3; // hack

				if (i == menu.indexOfChildSelected)
				{
					display.drawArrow(drawPos);
				}

				drawPos.y -= arrowSize.y / 3; // hack

				drawPos.add(spacing);

			} // end for
		}
	}

}
