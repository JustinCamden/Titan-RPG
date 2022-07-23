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

    // Condition removal options;
    // If all is not checked
    const conditionRemovalData = this.item.system.conditionRemoval;
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
        // If Any is <= 0
        if (conditionRemovalData.any <= 0) {
          conditionRemovalOptions.any = "TITAN.any.label";
        }
        conditionRemovalOptions.all = "TITAN.all.label";
        context.conditionRemovalOptions = conditionRemovalOptions;
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
    console.log(selected);
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
}
