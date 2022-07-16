/**
 * Define a set of template paths to pre-load
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/titan/templates/actor/components/actor-actions-tab.hbs",
    "systems/titan/templates/actor/components/actor-inventory-tab.hbs",
    "systems/titan/templates/actor/components/actor-skills-tab.hbs",
    "systems/titan/templates/actor/components/actor-actions-attacks.hbs",

    // Item partials
    "systems/titan/templates/item/weapon/components/weapon-description-tab.hbs",
    "systems/titan/templates/item/weapon/components/weapon-attacks-tab.hbs",
    "systems/titan/templates/item/weapon/components/weapon-attack-sheet-vertical.hbs",
    "systems/titan/templates/item/components/item-rarity.hbs",
    "systems/titan/templates/item/components/item-value.hbs",

    // Chat message partials
    "systems/titan/templates/chat-message/components/traits-container.hbs",
    "systems/titan/templates/chat-message/components/description.hbs",
    "systems/titan/templates/chat-message/components/damage-buttons.hbs",

    // Check partials
    "systems/titan/templates/checks/components/check-attribute-skill.hbs",
    "systems/titan/templates/checks/components/check-dice-container.hbs",
    "systems/titan/templates/checks/components/check-results-banner.hbs",
  ]);
};
