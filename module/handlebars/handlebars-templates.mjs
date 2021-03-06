/**
 * Define a set of template paths to pre-load
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    "systems/titan/templates/actor/components/actor-sheet-actions-tab.hbs",
    "systems/titan/templates/actor/components/actor-sheet-inventory-tab.hbs",
    "systems/titan/templates/actor/components/actor-sheet-skills-tab.hbs",
    "systems/titan/templates/actor/components/actor-sheet-actions-attacks.hbs",

    // Item partials
    "systems/titan/templates/item/components/item-sheet-value-rarity-header.hbs",
    "systems/titan/templates/item/weapon/components/weapon-sheet-description-tab.hbs",
    "systems/titan/templates/item/weapon/components/weapon-sheet-attacks-tab.hbs",
    "systems/titan/templates/item/weapon/components/weapon-sheet-attack-sheet-vertical.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-tradition-rarity-header.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-description-tab.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-range.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-target.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-damage.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-healing.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-duration.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-remove-condition.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-inflict-condition.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-increase-skill.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-decrease-skill.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-increase-resistance.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-decrease-resistance.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-increase-attribute.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-decrease-attribute.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-increase-rating.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-decrease-rating.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-overcast.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-number-input.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-checkbox-input.hbs",
    "systems/titan/templates/item/spell/components/spell-sheet-aspects-tab-resistance-check-select.hbs",

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
