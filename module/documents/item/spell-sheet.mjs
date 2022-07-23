import { TitanItemSheet } from "./item-sheet.mjs";
/**
 * Extend the basic ItemSheet with some very simple modifications
 */
export class TitanSpellSheet extends TitanItemSheet {
  get template() {
    return `systems/titan/templates/item/spell/spell-sheet.hbs`;
  }

  getData() {
    // Retrieve base data structure.
    const context = super.getData();
    const systemData = this.item.system;

    // Range Options
    context.rangeOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.range.option)) {
      context.rangeOptions[k] = v.label;
    }

    // Target Options
    context.targetOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.target.option)) {
      context.targetOptions[k] = v.label;
    }
    context.targetOptions.custom = "TITAN.custom.label";

    // Resistance Options
    context.resistanceCheckOptions = {
      none: CONFIG.TITAN.none.label,
    };
    for (let [k, v] of Object.entries(CONFIG.TITAN.resistance.option)) {
      context.resistanceCheckOptions[k] = v.label;
    }

    // Duration options
    context.durationOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.duration.period.option)) {
      context.durationOptions[k] = v.label;
    }
    context.durationOptions.custom = "TITAN.custom.label";

    // Condition removal options
    const conditionRemovalData = systemData.conditionRemoval;
    if (conditionRemovalData.all == false) {
      const conditionRemovalOptions = {
        none: "TITAN.none.label",
      };
      for (let [k, v] of Object.entries(conditionRemovalData.condition)) {
        if (v == false) {
          conditionRemovalOptions[k] = CONFIG.TITAN.condition.option[k].label;
        }
      }
      if (Object.keys(conditionRemovalOptions).length > 1) {
        if (conditionRemovalData.any <= 0) {
          conditionRemovalOptions.any = "TITAN.any.label";
        }
        conditionRemovalOptions.all = "TITAN.all.label";
        context.conditionRemovalOptions = conditionRemovalOptions;
      }
    }

    // Condition infliction options
    const conditionInflictionData = systemData.conditionInfliction;
    const conditionInflictionOptions = {
      none: "TITAN.none.label",
    };
    for (let [k, v] of Object.entries(conditionInflictionData)) {
      if (v.enabled == false) {
        conditionInflictionOptions[k] = CONFIG.TITAN.condition.option[k].label;
      }
    }
    if (Object.keys(conditionInflictionOptions).length > 1) {
      context.conditionInflictionOptions = conditionInflictionOptions;
    }

    // Skill increase options
    const increaseSkillData = systemData.increaseSkill;
    if (increaseSkillData.chosen == false) {
      const increaseSkillOptions = {
        none: "TITAN.none.label",
      };
      for (let [k, v] of Object.entries(increaseSkillData.skill)) {
        if (v == false) {
          increaseSkillOptions[k] = CONFIG.TITAN.skill.option[k].label;
        }
      }
      if (Object.keys(increaseSkillOptions).length > 1) {
        increaseSkillOptions.chosen = "TITAN.choose.label";
        context.increaseSkillOptions = increaseSkillOptions;
      }
    }

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) {
      return;
    }

    html
      .find(".add-condition-removal")
      .change(this._onAddConditionRemoval.bind(this));

    html
      .find(".delete-condition-removal")
      .click(this._onDeleteConditionRemoval.bind(this));

    html
      .find(".add-condition-infliction")
      .change(this._onAddConditionInfliction.bind(this));

    html
      .find(".delete-condition-infliction")
      .click(this._onDeleteConditionInfliction.bind(this));

    return;
  }

  // Adding condition removal
  _onAddConditionRemoval(event) {
    event.preventDefault();
    const conditionRemovalData = this.item.system.conditionRemoval;

    const selected = event.target.value;
    switch (selected) {
      case "all": {
        conditionRemovalData.all = true;
        break;
      }
      case "any": {
        conditionRemovalData.any = 1;
        break;
      }
      default: {
        conditionRemovalData.condition[selected] = true;
        break;
      }
    }

    this.item.update({
      system: {
        conditionRemoval: conditionRemovalData,
      },
    });
  }

  // Deleting condition removal
  _onDeleteConditionRemoval(event) {
    event.preventDefault();
    const conditionRemovalData = this.item.system.conditionRemoval;
    const selected = event.target.dataset.condition;
    switch (selected) {
      case "all": {
        conditionRemovalData.all = false;
        break;
      }
      default: {
        conditionRemovalData.condition[selected] = false;
        break;
      }
    }

    this.item.update({
      system: {
        conditionRemoval: conditionRemovalData,
      },
    });
  }

  // Adding condition removal
  _onAddConditionInfliction(event) {
    event.preventDefault();
    const conditionInflictionData = this.item.system.conditionInfliction;

    const selected = event.target.value;
    conditionInflictionData[selected].enabled = true;

    this.item.update({
      system: {
        conditionInfliction: conditionInflictionData,
      },
    });
  }

  // Deleting condition removal
  _onDeleteConditionInfliction(event) {
    event.preventDefault();
    const conditionInflictionData = this.item.system.conditionInfliction;

    const selected = event.target.dataset.condition;
    conditionInflictionData[selected].enabled = false;

    this.item.update({
      system: {
        conditionInfliction: conditionInflictionData,
      },
    });
  }
}
