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

    // Range
    context.rangeOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.range.option)) {
      context.rangeOptions[k] = v.label;
    }

    // Target
    context.targetOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.target.option)) {
      context.targetOptions[k] = v.label;
    }

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Edit target type
    html.find(".edit-target-type").change(this._onEditTargetType.bind(this));

    // Calculate target success cost
    html
      .find(".edit-target-calculate-success-cost")
      .change(this._onEditTargetCalculateSuccessCost.bind(this));

    // Edit damage ignore armor
    html
      .find(".edit-damage-ignore-armor")
      .change(this._onEditDamageIgnoreArmor.bind(this));

    // Calculate damage success cost
    html
      .find(".edit-damage-calculate-success-cost")
      .change(this._onEditDamageCalculateSuccessCost.bind(this));

    return;
  }

  async _onEditTargetType(event) {
    // If overcast enabled and calculate success cost
    const targetData = this.item.system.target;
    if (targetData.overcast.calculateSuccessCost) {
      // Calculate the overcast cost
      targetData.overcast.successCost = event.target.value == "zone" ? 3 : 1;

      // Update the spell
      return await this.item.update({
        system: {
          target: targetData,
        },
      });
    }

    return;
  }

  async _onEditTargetCalculateSuccessCost(event) {
    // If overcast enabled and calculate success cost
    const targetData = this.item.system.target;
    if (event.target.checked) {
      // Calculate the overcast cost
      targetData.overcast.successCost = targetData.type == "zone" ? 3 : 1;

      // Update the spell
      return await this.item.update({
        system: {
          target: targetData,
        },
      });
    }

    return;
  }

  async _onEditDamageIgnoreArmor(event) {
    // If overcast enabled and calculate success cost
    const damageData = this.item.system.damage;
    if (damageData.overcast.calculateSuccessCost) {
      // Calculate the overcast cost
      damageData.overcast.successCost = event.target.checked ? 2 : 1;

      // Update the spell
      return await this.item.update({
        system: {
          damage: damageData,
        },
      });
    }

    return;
  }

  async _onEditDamageCalculateSuccessCost(event) {
    // If overcast enabled and calculate success cost
    const damageData = this.item.system.damage;
    if (event.target.checked && damageData.overcast.enable) {
      // Calculate the overcast cost
      damageData.overcast.successCost = damageData.ignoreArmor ? 2 : 1;

      // Update the spell
      return await this.item.update({
        system: {
          damage: damageData,
        },
      });
    }

    return;
  }
}
