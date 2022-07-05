/**
 * Define a set of helpers to register
 */
export const registerHandlebarsHelpers = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/titan/templates/actor/parts/actor-features.hbs",
    "systems/titan/templates/actor/parts/actor-inventory.hbs",
    "systems/titan/templates/actor/parts/actor-skills.hbs",
    "systems/titan/templates/actor/parts/actor-spells.hbs",
    "systems/titan/templates/actor/parts/actor-effects.hbs",

    // Dialogs
    "systems/titan/templates/checks/check-basic.hbs",
    "systems/titan/templates/checks/check-basic-dialog.hbs",
    "systems/titan/templates/item/item-trait-dialog.hbs",

    // Item partials
    "systems/titan/templates/item/weapon/weapon-description-tab.hbs",
    "systems/titan/templates/item/weapon/weapon-attacks-tab.hbs",
    "systems/titan/templates/item/weapon/weapon-attack-sheet-vertical.hbs",
  ]);
};
