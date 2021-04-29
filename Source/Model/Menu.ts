
class Menu
{
	text: string;
	pos: Coords;
	spacing: Coords;
	menuable: any,
	updateEncounter: any;
	children: Menu[];
	indexOfChildSelected: number;

	_entityForArrow: Entity;
	_visualArrow: VisualArrow;

	constructor
	(
		text: string, pos: Coords, spacing: Coords, menuable: any,
		updateEncounter: any, children: Menu[], indexOfChildSelected: number
	)
	{
		this.text = text;
		this.pos = pos;
		this.spacing = spacing;
		this.menuable = menuable;
		this.updateEncounter = updateEncounter;
		this.children = children;
		this.indexOfChildSelected = indexOfChildSelected;

		this._entityForArrow = { "pos": new Coords() };
		this._visualArrow = new VisualArrow();
	}

	static menuablesToMenus
	(
		menuables: any[],
		bindingPathsForMenuText: string[],
		updateEncounter: any
	): Menu[]
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

	childSelected(): Menu
	{
		return (this.indexOfChildSelected == null ? null : this.children[this.indexOfChildSelected]);
	}

	indexOfChildSelectedAdd(valueToAdd: number): void
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

	updateEncounterForTimerTick(encounter: Encounter): void
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

				var childSelected = this.childSelected();

				this.isLocked = true;

				encounter.entitiesToRemove.push(this);
				var hasNoChildren =
					(childSelected.children == null || childSelected.children.length == 0);
				if (hasNoChildren)
				{
					var agent = encounter.agentCurrent;
					var agentAction = agent.action;
					agentAction.defnName = childSelected.text;
					childSelected.updateEncounter(encounter, agent);
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

	draw(universe: Universe, world: World, display: Display): void
	{
		var menu = this;
		var pos = menu.pos;
		var spacing = menu.spacing;

		var arrowSize = Coords.fromXY(8, 8);
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
					display.fontHeightInPixels,
					drawPos
				);

				if (i == menu.indexOfChildSelected)
				{
					this._entityForArrow.pos.overwriteWith(drawPos); // hack
					this._visualArrow.draw(universe, world, display, this._entityForArrow);
				}

				drawPos.add(spacing);

			} // end for
		}
	}

}
