/**
 * Define a set of helpers to register
 */
export const registerHandlebarsHelpers = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/titan/templates/actor/parts/actor-actions-tab.hbs",
    "systems/titan/templates/actor/parts/actor-inventory-tab.hbs",
    "systems/titan/templates/actor/parts/actor-skills-tab.hbs",

    // Item partials
    "systems/titan/templates/item/weapon/weapon-description-tab.hbs",
    "systems/titan/templates/item/weapon/weapon-attacks-tab.hbs",
    "systems/titan/templates/item/weapon/weapon-attack-sheet-vertical.hbs",

    // Check partials
    "systems/titan/templates/checks/components/check-dice-container.hbs",
    "systems/titan/templates/checks/components/check-results-banner.hbs",
    "systems/titan/templates/checks/components/check-attribute-skill.hbs",
  ]);
};
