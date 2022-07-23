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
    if (increaseSkillData.initialValue > 0) {
      context.increaseSkill = increaseSkillData.choose > 0;
      const increaseSkillOptions = {
        none: "TITAN.none.label",
      };
      for (let [k, v] of Object.entries(increaseSkillData.skill)) {
        if (v == false) {
          increaseSkillOptions[k] = CONFIG.TITAN.skill.option[k].label;
        } else {
          context.increaseSkill = true;
        }
      }
      if (Object.keys(increaseSkillOptions).length > 1) {
        increaseSkillOptions.choose = "TITAN.choose.label";
        context.increaseSkillOptions = increaseSkillOptions;
      }
    }

    // Skill decrease options
    const decreaseSkillData = systemData.decreaseSkill;
    context.decreaseSkill = decreaseSkillData.choose > 0;
    const decreaseSkillOptions = {
      none: "TITAN.none.label",
    };
    for (let [k, v] of Object.entries(decreaseSkillData.skill)) {
      if (v == false) {
        decreaseSkillOptions[k] = CONFIG.TITAN.skill.option[k].label;
      } else {
        context.decreaseSkill = true;
      }
    }
    if (Object.keys(decreaseSkillOptions).length > 1) {
      decreaseSkillOptions.choose = "TITAN.choose.label";
      context.decreaseSkillOptions = decreaseSkillOptions;
    }

    // Resistance increase options
    const increaseResistanceData = systemData.increaseResistance;
    context.increaseResistance = increaseResistanceData.choose > 0;
    const increaseResistanceOptions = {
      none: "TITAN.none.label",
    };
    for (let [k, v] of Object.entries(increaseResistanceData.resistance)) {
      if (v == false) {
        increaseResistanceOptions[k] = CONFIG.TITAN.resistance.option[k].label;
      } else {
        context.increaseResistance = true;
      }
    }
    if (Object.keys(increaseResistanceOptions).length > 1) {
      increaseResistanceOptions.choose = "TITAN.choose.label";
      context.increaseResistanceOptions = increaseResistanceOptions;
    }

    // Resistance decrease options
    const decreaseResistanceData = systemData.decreaseResistance;
    context.decreaseResistance = decreaseResistanceData.choose > 0;
    const decreaseResistanceOptions = {
      none: "TITAN.none.label",
    };
    for (let [k, v] of Object.entries(decreaseResistanceData.resistance)) {
      if (v == false) {
        decreaseResistanceOptions[k] = CONFIG.TITAN.resistance.option[k].label;
      } else {
        context.decreaseResistance = true;
      }
    }
    if (Object.keys(decreaseResistanceOptions).length > 1) {
      decreaseResistanceOptions.choose = "TITAN.choose.label";
      context.decreaseResistanceOptions = decreaseResistanceOptions;
    }

    // Attribute increase options
    const increaseAttributeData = systemData.increaseAttribute;
    context.increaseAttribute = increaseAttributeData.choose > 0;
    const increaseAttributeOptions = {
      none: "TITAN.none.label",
    };
    for (let [k, v] of Object.entries(increaseAttributeData.attribute)) {
      if (v == false) {
        increaseAttributeOptions[k] = CONFIG.TITAN.attribute.option[k].label;
      } else {
        context.increaseAttribute = true;
      }
    }
    if (Object.keys(increaseAttributeOptions).length > 1) {
      increaseAttributeOptions.choose = "TITAN.choose.label";
      context.increaseAttributeOptions = increaseAttributeOptions;
    }

    // Attribute decrease options
    const decreaseAttributeData = systemData.decreaseAttribute;
    context.decreaseAttribute = decreaseAttributeData.choose > 0;
    const decreaseAttributeOptions = {
      none: "TITAN.none.label",
    };
    for (let [k, v] of Object.entries(decreaseAttributeData.attribute)) {
      if (v == false) {
        decreaseAttributeOptions[k] = CONFIG.TITAN.attribute.option[k].label;
      } else {
        context.decreaseAttribute = true;
      }
    }
    if (Object.keys(decreaseAttributeOptions).length > 1) {
      decreaseAttributeOptions.choose = "TITAN.choose.label";
      context.decreaseAttributeOptions = decreaseAttributeOptions;
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

    html
      .find(".add-increase-resistance")
      .change(this._onAddIncreaseResistance.bind(this));

    html
      .find(".delete-increase-resistance")
      .click(this._onDeleteIncreaseResistance.bind(this));

    html
      .find(".add-decrease-resistance")
      .change(this._onAddDecreaseResistance.bind(this));

    html
      .find(".delete-decrease-resistance")
      .click(this._onDeleteDecreaseResistance.bind(this));

    html
      .find(".add-increase-attribute")
      .change(this._onAddIncreaseAttribute.bind(this));

    html
      .find(".delete-increase-attribute")
      .click(this._onDeleteIncreaseAttribute.bind(this));

    html
      .find(".add-decrease-attribute")
      .change(this._onAddDecreaseAttribute.bind(this));

    html
      .find(".delete-decrease-attribute")
      .click(this._onDeleteDecreaseAttribute.bind(this));

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
      increaseSkillData.choose = 1;
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
      increaseSkillData.choose = 0;
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
      decreaseSkillData.choose = 1;
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
      decreaseSkillData.choose = 0;
    } else {
      decreaseSkillData.skill[selected] = false;
    }

    this.item.update({
      system: {
        decreaseSkill: decreaseSkillData,
      },
    });
  }

  _onAddIncreaseResistance(event) {
    event.preventDefault();
    const increaseResistanceData = this.item.system.increaseResistance;

    const selected = event.target.value;
    if (selected == "choose") {
      increaseResistanceData.choose = 1;
    } else {
      increaseResistanceData.resistance[selected] = true;
    }

    this.item.update({
      system: {
        increaseResistance: increaseResistanceData,
      },
    });
  }

  _onDeleteIncreaseResistance(event) {
    event.preventDefault();
    const increaseResistanceData = this.item.system.increaseResistance;

    const selected = event.target.dataset.resistance;
    if (selected == "choose") {
      increaseResistanceData.choose = 0;
    } else {
      increaseResistanceData.resistance[selected] = false;
    }

    this.item.update({
      system: {
        increaseResistance: increaseResistanceData,
      },
    });
  }

  _onAddDecreaseResistance(event) {
    event.preventDefault();
    const decreaseResistanceData = this.item.system.decreaseResistance;

    const selected = event.target.value;
    if (selected == "choose") {
      decreaseResistanceData.choose = 1;
    } else {
      decreaseResistanceData.resistance[selected] = true;
    }

    this.item.update({
      system: {
        decreaseResistance: decreaseResistanceData,
      },
    });
  }

  _onDeleteDecreaseResistance(event) {
    event.preventDefault();
    const decreaseResistanceData = this.item.system.decreaseResistance;

    const selected = event.target.dataset.resistance;
    if (selected == "choose") {
      decreaseResistanceData.choose = 0;
    } else {
      decreaseResistanceData.resistance[selected] = false;
    }

    this.item.update({
      system: {
        decreaseResistance: decreaseResistanceData,
      },
    });
  }

  _onAddIncreaseAttribute(event) {
    event.preventDefault();
    const increaseAttributeData = this.item.system.increaseAttribute;

    const selected = event.target.value;
    if (selected == "choose") {
      increaseAttributeData.choose = 1;
    } else {
      increaseAttributeData.attribute[selected] = true;
    }

    this.item.update({
      system: {
        increaseAttribute: increaseAttributeData,
      },
    });
  }

  _onDeleteIncreaseAttribute(event) {
    event.preventDefault();
    const increaseAttributeData = this.item.system.increaseAttribute;

    const selected = event.target.dataset.attribute;
    if (selected == "choose") {
      increaseAttributeData.choose = 0;
    } else {
      increaseAttributeData.attribute[selected] = false;
    }

    this.item.update({
      system: {
        increaseAttribute: increaseAttributeData,
      },
    });
  }

  _onAddDecreaseAttribute(event) {
    event.preventDefault();
    const decreaseAttributeData = this.item.system.decreaseAttribute;

    const selected = event.target.value;
    if (selected == "choose") {
      decreaseAttributeData.choose = 1;
    } else {
      decreaseAttributeData.attribute[selected] = true;
    }

    this.item.update({
      system: {
        decreaseAttribute: decreaseAttributeData,
      },
    });
  }

  _onDeleteDecreaseAttribute(event) {
    event.preventDefault();
    const decreaseAttributeData = this.item.system.decreaseAttribute;

    const selected = event.target.dataset.attribute;
    if (selected == "choose") {
      decreaseAttributeData.choose = 0;
    } else {
      decreaseAttributeData.attribute[selected] = false;
    }

    this.item.update({
      system: {
        decreaseAttribute: decreaseAttributeData,
      },
    });
  }
}
