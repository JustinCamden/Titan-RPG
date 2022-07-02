/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/titan/templates/actor/parts/actor-features.hbs",
    "systems/titan/templates/actor/parts/actor-items.hbs",
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
  ]);
};
