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
    const removeConditionData = systemData.removeCondition;
    if (removeConditionData.all == false) {
      const removeConditionOptions = {
        none: "TITAN.none.label",
      };
      for (let [k, v] of Object.entries(removeConditionData.condition)) {
        if (v == false) {
          removeConditionOptions[k] = CONFIG.TITAN.condition.option[k].label;
        }
      }
      if (Object.keys(removeConditionOptions).length > 1) {
        if (removeConditionData.any <= 0) {
          removeConditionOptions.any = "TITAN.any.label";
        }
        removeConditionOptions.all = "TITAN.all.label";
        context.removeConditionOptions = removeConditionOptions;
      }
    }

    // Condition infliction options
    const inflictConditionData = systemData.inflictCondition;
    const inflictConditionOptions = {
      none: "TITAN.none.label",
    };
    for (let [k, v] of Object.entries(inflictConditionData)) {
      if (v.enabled == false) {
        inflictConditionOptions[k] = CONFIG.TITAN.condition.option[k].label;
      }
    }
    if (Object.keys(inflictConditionOptions).length > 1) {
      context.inflictConditionOptions = inflictConditionOptions;
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
      .find(".add-remove-condition")
      .change(this._onAddConditionRemoval.bind(this));

    html
      .find(".delete-remove-condition")
      .click(this._onDeleteConditionRemoval.bind(this));

    html
      .find(".add-inflict-condition")
      .change(this._onAddConditionInfliction.bind(this));

    html
      .find(".delete-inflict-condition")
      .click(this._onDeleteConditionInfliction.bind(this));

    return;
  }

  // Adding condition removal
  _onAddConditionRemoval(event) {
    event.preventDefault();
    const removeConditionData = this.item.system.removeCondition;

    const selected = event.target.value;
    switch (selected) {
      case "all": {
        removeConditionData.all = true;
        break;
      }
      case "any": {
        removeConditionData.any = 1;
        break;
      }
      default: {
        removeConditionData.condition[selected] = true;
        break;
      }
    }

    this.item.update({
      system: {
        removeCondition: removeConditionData,
      },
    });
  }

  // Deleting condition removal
  _onDeleteConditionRemoval(event) {
    event.preventDefault();
    const removeConditionData = this.item.system.removeCondition;
    const selected = event.target.dataset.condition;
    switch (selected) {
      case "all": {
        removeConditionData.all = false;
        break;
      }
      default: {
        removeConditionData.condition[selected] = false;
        break;
      }
    }

    this.item.update({
      system: {
        removeCondition: removeConditionData,
      },
    });
  }

  // Adding condition removal
  _onAddConditionInfliction(event) {
    event.preventDefault();
    const inflictConditionData = this.item.system.inflictCondition;

    const selected = event.target.value;
    inflictConditionData[selected].enabled = true;

    this.item.update({
      system: {
        inflictCondition: inflictConditionData,
      },
    });
  }

  // Deleting condition removal
  _onDeleteConditionInfliction(event) {
    event.preventDefault();
    const inflictConditionData = this.item.system.inflictCondition;

    const selected = event.target.dataset.condition;
    inflictConditionData[selected].enabled = false;

    this.item.update({
      system: {
        inflictCondition: inflictConditionData,
      },
    });
  }
}
