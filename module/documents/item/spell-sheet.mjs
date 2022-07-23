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
        if (removeConditionData.any.initialValue <= 0) {
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
    context.increaseSkillOvercastAvailable = false;
    if (increaseSkillData.choose == false) {
      const increaseSkillOptions = {
        none: "TITAN.none.label",
      };
      for (let [k, v] of Object.entries(increaseSkillData.skill)) {
        if (v == false) {
          increaseSkillOptions[k] = CONFIG.TITAN.skill.option[k].label;
        } else {
          context.increaseSkillOvercastAvailable = true;
        }
      }
      if (Object.keys(increaseSkillOptions).length > 1) {
        increaseSkillOptions.chosen = "TITAN.choose.label";
        context.increaseSkillOptions = increaseSkillOptions;
      }
    } else {
      context.increaseSkillOvercastAvailable = true;
    }

    // Skill decrease options
    const decreaseSkillData = systemData.decreaseSkill;
    context.decreaseSkillOvercastAvailable = false;
    if (decreaseSkillData.choose == false) {
      const decreaseSkillOptions = {
        none: "TITAN.none.label",
      };
      for (let [k, v] of Object.entries(decreaseSkillData.skill)) {
        if (v == false) {
          decreaseSkillOptions[k] = CONFIG.TITAN.skill.option[k].label;
        } else {
          context.decreaseSkillOvercastAvailable = true;
        }
      }
      if (Object.keys(decreaseSkillOptions).length > 1) {
        decreaseSkillOptions.chosen = "TITAN.choose.label";
        context.decreaseSkillOptions = decreaseSkillOptions;
      }
    } else {
      context.decreaseSkillOvercastAvailable = true;
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
      .change(this._onAddRemoveCondition.bind(this));

    html
      .find(".delete-remove-condition")
      .click(this._onDeleteRemoveCondition.bind(this));

    html
      .find(".add-inflict-condition")
      .change(this._onAddInflictCondition.bind(this));

    html
      .find(".delete-inflict-condition")
      .click(this._onDeleteInflictCondition.bind(this));

    html
      .find(".add-increase-skill")
      .change(this._onAddIncreaseSkill.bind(this));

    html
      .find(".delete-increase-skill")
      .click(this._onDeleteIncreaseSkill.bind(this));

    html
      .find(".add-decrease-skill")
      .change(this._onAddDecreaseSkill.bind(this));

    html
      .find(".delete-decrease-skill")
      .click(this._onDeleteDecreaseSkill.bind(this));

    return;
  }

  _onAddRemoveCondition(event) {
    event.preventDefault();
    const removeConditionData = this.item.system.removeCondition;

    const selected = event.target.value;
    switch (selected) {
      case "all": {
        removeConditionData.all = true;
        break;
      }
      case "any": {
        removeConditionData.any.initialValue = 1;
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

  _onDeleteRemoveCondition(event) {
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

  _onAddInflictCondition(event) {
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

  _onDeleteInflictCondition(event) {
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

  _onAddIncreaseSkill(event) {
    event.preventDefault();
    const increaseSkillData = this.item.system.increaseSkill;

    const selected = event.target.value;
    if (selected == "choose") {
      increaseSkillData.choose = true;
    } else {
      increaseSkillData.skill[selected] = true;
    }

    this.item.update({
      system: {
        increaseSkill: increaseSkillData,
      },
    });
  }

  _onDeleteIncreaseSkill(event) {
    event.preventDefault();
    const increaseSkillData = this.item.system.increaseSkill;

    const selected = event.target.dataset.skill;
    if (selected == "choose") {
      increaseSkillData.choose = false;
    } else {
      increaseSkillData.skill[selected] = false;
    }

    this.item.update({
      system: {
        increaseSkill: increaseSkillData,
      },
    });
  }

  _onAddDecreaseSkill(event) {
    event.preventDefault();
    const decreaseSkillData = this.item.system.decreaseSkill;

    const selected = event.target.value;
    if (selected == "choose") {
      decreaseSkillData.choose = true;
    } else {
      decreaseSkillData.skill[selected] = true;
    }

    this.item.update({
      system: {
        decreaseSkill: decreaseSkillData,
      },
    });
  }

  _onDeleteDecreaseSkill(event) {
    event.preventDefault();
    const decreaseSkillData = this.item.system.decreaseSkill;

    const selected = event.target.dataset.skill;
    if (selected == "choose") {
      decreaseSkillData.choose = false;
    } else {
      decreaseSkillData.skill[selected] = false;
    }

    this.item.update({
      system: {
        decreaseSkill: decreaseSkillData,
      },
    });
  }
}
