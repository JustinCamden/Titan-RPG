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

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Edit target type
    html.find(".edit-target-type").change(this._onEditTargetType.bind(this));

    // Edit Calculate target success cost
    html
      .find(".edit-target-calculate-success-cost")
      .change(this._onEditTargetCalculateSuccessCost.bind(this));

    // Edit damage ignore armor
    html
      .find(".edit-damage-ignore-armor")
      .change(this._onEditDamageIgnoreArmor.bind(this));

    // Edit damage resistance check
    html
      .find(".edit-damage-resistance-check")
      .change(this._onEditDamageResistanceCheck.bind(this));

    // Edit calculate damage success cost
    html
      .find(".edit-damage-calculate-success-cost")
      .change(this._onEditDamageCalculateSuccessCost.bind(this));

    // Edit calculate healing success cost
    html
      .find(".edit-healing-calculate-success-cost")
      .change(this._onEditHealingCalculateSuccessCost.bind(this));

    // Edit calculate healing success cost
    html
      .find(".edit-duration-calculate-success-cost")
      .change(this._onEditDurationCalculateSuccessCost.bind(this));

    return;
  }

  async _onEditTargetType(event) {
    event.preventDefault();

    // Update data
    const targetData = this.item.system.target;
    targetData.type = event.target.value;
    targetData.overcast.successCost =
      this.item.spell.calculateTargetOvercastSuccessCost(targetData);

    // Update the item
    this.item.update({
      system: {
        target: targetData,
      },
    });

    return;
  }

  async _onEditTargetCalculateSuccessCost(event) {
    event.preventDefault();

    // Update data
    const targetData = this.item.system.target;
    targetData.overcast.calculateSuccessCost = event.target.checked
      ? true
      : false;
    targetData.overcast.successCost =
      this.item.spell.calculateTargetOvercastSuccessCost(targetData);

    // Update the item
    this.item.update({
      system: {
        target: targetData,
      },
    });

    return;
  }

  async _onEditDamageIgnoreArmor(event) {
    event.preventDefault();

    // Update the data
    const damageData = this.item.system.damage;
    damageData.ignoreArmor = event.target.checked ? true : false;
    damageData.overcast.successCost =
      this.item.spell.calculateDamageOvercastSuccessCost(damageData);

    // Update the item
    this.item.update({
      system: {
        damage: damageData,
      },
    });

    return;
  }

  async _onEditDamageResistanceCheck(event) {
    event.preventDefault();

    // Update the data
    const damageData = this.item.system.damage;
    damageData.resistanceCheck = event.target.value;
    damageData.overcast.successCost =
      this.item.spell.calculateDamageOvercastSuccessCost(damageData);

    // Update the item
    this.item.update({
      system: {
        damage: damageData,
      },
    });

    return;
  }

  async _onEditDamageCalculateSuccessCost(event) {
    event.preventDefault();

    // Update the data
    const damageData = this.item.system.damage;
    damageData.overcast.calculateSuccessCost = event.target.checked
      ? true
      : false;
    damageData.overcast.successCost =
      this.item.spell.calculateDamageOvercastSuccessCost(damageData);

    // Update the item
    this.item.update({
      system: {
        damage: damageData,
      },
    });

    return;
  }

  async _onEditHealingCalculateSuccessCost(event) {
    // If overcast enabled and calculate success cost
    const healingData = this.item.system.healing;
    healingData.overcast.calculateSuccessCost = event.target.checked
      ? true
      : false;
    healingData.overcast.successCost =
      this.item.spell.calculateHealingOvercastSuccessCost(healingData);

    // Update the item
    this.item.update({
      system: {
        healing: healingData,
      },
    });

    return;
  }

  async _onEditDurationCalculateSuccessCost(event) {
    // If overcast enabled and calculate success cost
    const durationData = this.item.system.duration;
    durationData.overcast.calculateSuccessCost = event.target.checked
      ? true
      : false;
    durationData.overcast.successCost =
      this.item.spell.calculateHealingOvercastSuccessCost(durationData);

    // Update the item
    this.item.update({
      system: {
        duration: durationData,
      },
    });

    return;
  }
}
