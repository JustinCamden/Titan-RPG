// Import document classes.
import { TitanActor } from "./documents/actor/actor.mjs";
import { TitanItem } from "./documents/item/item.mjs";
// Import sheet classes.
import { TitanActorSheet } from "./documents/actor/actor-sheet.mjs";
import { TitanItemSheet } from "./documents/item/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./handlebars/handlebars-templates.mjs";
import { registerHandlebarsHelpers } from "./handlebars/handlebars-helpers.mjs";
import { TITAN } from "./helpers/config.mjs";
import { TitanUtility } from "./helpers/utility.mjs";
import { TitanCheck } from "./helpers/check.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", async function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.titan = {
    TitanActor,
    TitanItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.TITAN = TITAN;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2,
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = TitanActor;
  CONFIG.Item.documentClass = TitanItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("titan", TitanActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("titan", TitanItemSheet, { makeDefault: true });

  // Register system settings
  registerSystemSettings();

  // Handlebars
  await registerHandlebarsHelpers();
  await preloadHandlebarsTemplates();

  return;
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper("concat", function () {
  var outStr = "";
  for (var arg in arguments) {
    if (typeof arguments[arg] != "object") {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data))
    return ui.notifications.warn(
      "You can only create macro buttons for owned Items"
    );
  const item = data.data;

  // Create the macro command
  const command = `game.titan.rollItemMacro("${item.name}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "titan.itemMacro": true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find((i) => i.name === itemName) : null;
  if (!item)
    return ui.notifications.warn(
      `Your controlled Actor does not have an item named ${itemName}`
    );

  // Trigger the item roll
  return item.roll();
}

/* -------------------------------------------- */
/*  System Settings                             */
/* -------------------------------------------- */
function registerSystemSettings() {
  game.settings.register("titan", "showCheckOptions", {
    config: true,
    scope: "client",
    name: "SETTINGS.showCheckOptions.label",
    hint: "SETTINGS.showCheckOptions.hint",
    type: Boolean,
    default: false,
  });

  game.settings.register("titan", "initiativeFormula", {
    config: true,
    scope: "world",
    name: "SETTINGS.initiativeFormula.label",
    hint: "SETTINGS.initiativeFormula.hint",
    type: String,
    restricted: true,
    choices: {
      flat: "SETTINGS.initiativeFormula.flat",
      roll1d6: "SETTINGS.initiativeFormula.roll1d6",
      roll2d6: "SETTINGS.initiativeFormula.roll2d6",
    },
    default: "roll2d6",
  });
}
