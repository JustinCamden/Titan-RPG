import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../../helpers/effects.mjs";
import { TitanActor } from "./actor.mjs";
import TitanUtility from "../../helpers/utility.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class TitanActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["titan", "sheet", "actor"],
      width: 880,
      height: 700,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "actions-tab",
        },
      ],
    });
  }

  /**
   * Temporary data that will be reset on page load
   */
  // Expended state
  isExpanded = {};

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare player data and items.
    if (actorData.type == "player") {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == "npc") {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {}

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const ability = [];
    const armor = [];
    const equipment = [];
    const gear = [];
    const miracle = [];
    const spell = [];
    const weapon = [];

    // Iterate through items, allocating to containers
    for (const item of context.items) {
      switch (item.type) {
        case "ability": {
          ability.push(item);
          break;
        }
        case "armor": {
          armor.push(item);
          break;
        }

        case "equipment": {
          equipment.push(item);
          break;
        }

        case "gear": {
          gear.push(item);
          break;
        }

        case "miracle": {
          miracle.push(item);
          break;
        }

        case "spell": {
          spell.push(item);
          break;
        }

        case "weapon": {
          weapon.push(item);
          break;
        }

        default: {
          break;
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.ability = ability;
    context.armor = armor;
    context.equipment = equipment;
    context.gear = gear;
    context.miracle = miracle;
    context.spell = spell;
    context.weapon = weapon;

    context.isExpanded = this.isExpanded;

    return;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Active Effect management
    html
      .find(".effect-control")
      .click((ev) => onManageActiveEffect(ev, this.actor));

    // Initiative rolls
    html.find(".initiative-roll").click(this._onInitiativeRoll.bind(this));

    // Rollable basic checks
    html.find(".skill-check").click(this._onSkillCheck.bind(this));

    // Rollable resistance checks
    html.find(".resistance-check").click(this._onResistanceCheck.bind(this));

    // Editing resources
    html.find(".resource-edit").change(this._onResourceEdit.bind(this));

    // Editing skill expertise
    html
      .find(".skill-expertise-edit")
      .change(this._onSkillExpertiseEdit.bind(this));

    // Editing skill training
    html
      .find(".skill-training-edit")
      .change(this._onSkillTrainingEdit.bind(this));

    // Expandable toggles
    html.find(".expand").click(this._onExpandElement.bind(this));

    // Item edit
    html.find(".item-edit").click(this._onItemEdit.bind(this));

    // Item delete
    html.find(".item-delete").click(this._onItemDelete.bind(this));

    // Item Create
    html.find(".item-create").click(this._onItemCreate.bind(this));

    // Weapon Attack
    html.find(".attack-check").click(this._onAttackCheck.bind(this));

    // Weapon multi attack
    html
      .find(".toggle-multi-attack")
      .change(this._onToggleMultiAttack.bind(this));

    // Weapon multi attack
    html.find(".send-item-to-chat").click(this._onSendItemToChat.bind(this));

    // Equip armor
    html.find(".equip-armor").click(this._onEquipArmor.bind(this));

    // Un-equip armor
    html.find(".un-equip-armor").click(this._onUnEquipArmor.bind(this));

    return;
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();

    const header = event.currentTarget;

    // Get the type of item to create.
    const type = header.dataset.type;

    // Grab any data associated with this control.
    const data = duplicate(header.dataset);

    // Initialize a default name.
    const name = `New ${type.capitalize()}`;

    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle rolls.
    if (dataset.rollType) {
      switch (dataset.rollType) {
        // Item rolls
        case "item": {
          const itemId = element.closest(".item").dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (item) return item.roll();
          return roll;
          break;
        }

        default: {
          return null;
          break;
        }
      }
    }
  }

  // Called when the player clicks an initiative check
  async _onInitiativeRoll(event) {
    event.preventDefault();
    this.getInitiativeRoll();
  }

  async getInitiativeRoll() {
    // Get the roll from the actor
    const rollResult = await this.actor.getInitiativeRoll();
    if (rollResult) {
      // Output the roll
      const roll = rollResult.outRoll;
      const localizedLabel = game.i18n.localize(
        CONFIG.TITAN.derivedStats.initiative
      );
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: localizedLabel,
        rollMode: game.settings.get("core", "rollMode"),
      });
    }

    return;
  }

  // Called when the player clicks a basic check
  async _onSkillCheck(event) {
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    const getOptions =
      dataset.getOptions == "true" ||
      game.settings.get("titan", "showCheckOptions") == true ||
      (dataset.getOptions == "default" && event.shiftKey);
    return await this.getSkillCheck({
      attribute: dataset.attribute,
      skill: dataset.skill,
      getOptions: getOptions,
    });
  }

  // Retrieves and posts a basic check
  async getSkillCheck(inData) {
    // Get a check from the actor
    let skillCheck = await this.actor.getSkillCheck(inData);
    if (skillCheck.cancelled || !skillCheck.isValid) {
      return;
    }

    // Evaluate the check
    await skillCheck.evaluateCheck();

    // Post the check to chat
    await skillCheck.sendToChat({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return;
  }

  // Called when the player clicks a resistance check
  async _onResistanceCheck(event) {
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    const getOptions =
      dataset.getOptions == "true" ||
      game.settings.get("titan", "showCheckOptions") == true ||
      (dataset.getOptions == "default" && event.shiftKey);
    return await this.getResistanceCheck({
      resistance: dataset.resistance,
      getOptions: getOptions,
    });
  }

  // Retrieve and post a resistance check
  async getResistanceCheck(inData) {
    // Get a check from the actor
    let resistanceCheck = await this.actor.getResistanceCheck(inData);
    if (resistanceCheck.cancelled || !resistanceCheck.isValid) {
      return;
    }

    // Evaluate the check
    await resistanceCheck.evaluateCheck();

    // Post the check to chat
    await resistanceCheck.sendToChat({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return;
  }

  async _onAttackCheck(event) {
    // Get the weapon id
    const itemId = event.currentTarget.closest(".weapon").dataset.itemId;

    // Get the attack idx
    const dataset = event.currentTarget.dataset;
    const attackIdx = dataset.attackIdx;

    const getOptions =
      dataset.getOptions == "true" ||
      game.settings.get("titan", "showCheckOptions") == true ||
      (dataset.getOptions == "default" && event.shiftKey);

    return await this.getAttackCheck({
      itemId: itemId,
      attackIdx: attackIdx,
      getOptions: getOptions,
    });
  }

  async getAttackCheck(inData) {
    // Get an attack check
    let attackCheck = await this.actor.getAttackCheck(inData);

    // Cancel if appropriate
    if (attackCheck.cancelled || !attackCheck.isValid) {
      return;
    }

    // Evaluate the check
    await attackCheck.evaluateCheck();

    // Post the check to chat
    const html = await attackCheck.sendToChat({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });
    return;
  }

  async _onAttributeEdit(event) {
    // Ensure the attribute is within a valid range
    const newValue = event.target.value;

    const maxAttributeValue = CONFIG.TITAN.attribute.settings.max;
    if (newValue > maxAttributeValue) {
      event.target.value = maxAttributeValue;
    } else {
      const minAttributeValue = CONFIG.TITAN.attribute.settings.min;
      if (newValue < minAttributeValue) {
        event.target.value = CONFIG.TITAN.attribute.settings.min;
      }
    }

    return;
  }

  async _onResourceEdit(event) {
    // Ensure the resource is within a valid range
    const resource = this.object.system.resource[event.target.dataset.resource];
    const newValue = event.target.value;

    if (newValue > resource.maxValue) {
      event.target.value = resource.maxValue;
    } else if (newValue < 0) {
      event.target.value = 0;
    }

    return;
  }

  async _onSkillTrainingEdit(event) {
    // Ensure the skill is within a valid range

    // Cap the training values within range
    event.target.value = TitanUtility.Clamp(
      event.target.value,
      0,
      CONFIG.TITAN.skill.training.max
    );

    return;
  }

  async _onSkillExpertiseEdit(event) {
    // Cap the expertise values within range
    event.target.value = TitanUtility.Clamp(
      event.target.value,
      0,
      CONFIG.TITAN.skill.expertise.max
    );
    return;
  }

  async _onExpandElement(event) {
    event.preventDefault();

    // Get the parent element
    let parent = $(event.currentTarget).parents(".expandable-parent");

    // Get the content element
    let content = parent.find(".expandable-content");

    // If the content is collapsed
    if (content.hasClass("collapsed")) {
      // Remove the collapsed class
      content.removeClass("collapsed");

      // Update the collapsed state
      const id =
        event.currentTarget.closest(".expandable-parent").dataset.expandableId;
      this.isExpanded[id.toString()] = true;
    } else {
      // Add the collapsed class
      content.addClass("collapsed");

      // Update the collapsed state
      const id =
        event.currentTarget.closest(".expandable-parent").dataset.expandableId;
      this.isExpanded[id.toString()] = false;
    }
  }

  _onItemEdit(event) {
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    item.sheet.render(true);
    return;
  }

  _onItemDelete(event) {
    // Get the item id
    const itemId = event.currentTarget.closest(".item").dataset.itemId;

    // Delete the item
    this.actor.deleteItem(itemId);

    // Delete the entries from the expanded array
    delete this.isExpanded["inventory" + itemId];
    delete this.isExpanded["actions" + itemId];

    return;
  }

  async _onToggleMultiAttack(event) {
    // Get the weapon ID
    const itemId = event.currentTarget.closest(".weapon").dataset.itemId;

    // Enable multi attack
    const weapon = this.actor.items.get(itemId);
    const enabled = event.target.checked;
    await weapon.update({
      system: {
        multiAttack: enabled,
      },
    });

    return;
  }

  async _onSendItemToChat(event) {
    // Get the item
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);

    // Post the item to chat
    await item.sendToChat({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      rollMode: game.settings.get("core", "rollMode"),
    });

    return;
  }

  _onEquipArmor(event) {
    const armorId = event.currentTarget.closest(".item").dataset.itemId;
    if (armorId) {
      this.actor.equipArmor(armorId);
    }

    return;
  }

  _onUnEquipArmor(event) {
    this.actor.unEquipArmor();

    return;
  }
}
