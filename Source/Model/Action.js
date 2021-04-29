"use strict";
class Action {
    constructor() {
        this.status = ActionStatus.Instances().None;
        this.parametersByName = new Map();
    }
    defn(agent) {
        var returnValue = agent.defn().actionDefnsByName.get(this.defnName);
        if (returnValue == null) {
            returnValue =
                Globals.Instance.universe.actionDefnsByName.get(this.defnName);
        }
        return returnValue;
    }
    parameterByName(parameterName) {
        return this.parametersByName.get(parameterName);
    }
    parameterByNameSet(parameterName, value) {
        return this.parametersByName.set(parameterName, value);
    }
    target() {
        return this.parameterByName("Target");
    }
    target_Set(valueToSet) {
        this.parameterByNameSet("Target", valueToSet);
    }
    updateEncounterAndAgentForTimerTick(encounter, agent) {
        var intelligence = encounter.partyCurrent().intelligence;
        var actionStatuses = ActionStatus.Instances();
        if (this.status == actionStatuses.None) {
            intelligence.actionInitialize(this, encounter, agent);
        }
        else if (this.status == actionStatuses.AwaitingActionDefn) {
            intelligence.decideActionDefn(this, encounter, agent);
        }
        else if (this.status == actionStatuses.AwaitingTarget) {
            intelligence.decideActionTarget(this, encounter, agent);
        }
        else if (this.status == actionStatuses.Running) {
            var actionDefn = this.defn(agent);
            actionDefn.perform(encounter, agent, this);
        }
        else if (this.status == actionStatuses.Complete) {
            //encounter.entitiesToRemove.push(agent.action);
            agent.action = null;
            agent.hasMovedThisTurn = true;
            encounter.agentCurrentAdvance();
        }
        else {
            throw "Invalid action status: " + this.status.name;
        }
    }
}
