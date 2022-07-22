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
}
