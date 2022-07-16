import { TitanItemSheet } from "./item-sheet.mjs";
/**
 * Extend the basic ItemSheet with some very simple modifications
 */
export class TitanArmorSheet extends TitanItemSheet {
  get template() {
    return `systems/titan/templates/item/armor/armor-sheet.hbs`;
  }
}
