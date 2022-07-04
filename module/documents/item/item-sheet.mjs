import { TITAN } from "../../helpers/config.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class TitanItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["titan", "sheet", "item"],
      width: 780,
      height: 620,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
      scrollY: [".scrolling"],
    });
  }
  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = this.item.toObject(false);

    // Add the items's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add item rarity options
    context.rarityOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.item.rarity.option)) {
      context.rarityOptions[k] = v.label;
    }

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) {
      return;
    }

    return;
  }
}
