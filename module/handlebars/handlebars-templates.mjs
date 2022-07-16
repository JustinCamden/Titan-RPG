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
    "systems/titan/templates/item/components/item-value-rarity-sheet-header.hbs",
    "systems/titan/templates/item/weapon/components/weapon-sheet-description-tab.hbs",
    "systems/titan/templates/item/weapon/components/weapon-sheet-attacks-tab.hbs",
    "systems/titan/templates/item/weapon/components/weapon-sheet-attack-sheet-vertical.hbs",

    // Generic Chat message partials
    "systems/titan/templates/chat-message/components/chat-message-traits-container.hbs",
    "systems/titan/templates/chat-message/components/chat-message-description.hbs",

    // Check partials
    "systems/titan/templates/checks/components/check-chat-message-attribute-skill.hbs",
    "systems/titan/templates/checks/components/check-chat-message-dice-container.hbs",
    "systems/titan/templates/checks/components/check-chat-message-results-banner.hbs",
    "systems/titan/templates/checks/components/check-chat-message-damage-buttons.hbs",
  ]);
};
