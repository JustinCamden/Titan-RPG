import { TitanItemSheet } from "./item-sheet.mjs";
/**
 * Extend the basic ItemSheet with some very simple modifications
 */
export class TitanArmorSheet extends TitanItemSheet {
  get template() {
    return `systems/titan/templates/item/armor/armor-sheet.hbs`;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Edit armor traits
    html.find(".edit-armor-traits").click(this._onEditArmorTraits.bind(this));
  }

  // Edit armor traits
  async _onEditArmorTraits(event) {
    event.preventDefault();

    this.item.armor.editArmorTraits();

    return;
  }
}
