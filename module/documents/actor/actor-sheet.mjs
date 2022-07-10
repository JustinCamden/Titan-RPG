import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../../helpers/effects.mjs";
import { TitanActor } from "./actor.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class TitanActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["titan", "sheet", "actor"],
      template: "systems/titan/templates/actor/actor-sheet.hbs",
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

  /** @override */
  get template() {
    return `systems/titan/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

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

    // Editing skill
    html.find(".skill-edit").change(this._onSkillEdit.bind(this));

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
    if (skillCheck.cancelled) {
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
    if (resistanceCheck.cancelled) {
      return;
    }

    // Get the localized label
    let localizedLabel = game.i18n.localize(
      CONFIG.TITAN.resistance.option[resistanceCheck.parameters.resistance]
        .label
    );

    // Evaluate the check
    await resistanceCheck.evaluateCheck();

    // Post the check to chat
    await resistanceCheck.sendToChat({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      label: localizedLabel,
      rollMode: game.settings.get("core", "rollMode"),
    });
    return;
  }

  async _onAttackCheck(event) {
    // Get the weapon id
    const weaponId = event.currentTarget.closest(".weapon").dataset.weaponId;

    // Get the attack idx
    const dataset = event.currentTarget.dataset;
    const attackIdx = dataset.attackIdx;

    const getOptions =
      dataset.getOptions == "true" ||
      game.settings.get("titan", "showCheckOptions") == true ||
      (dataset.getOptions == "default" && event.shiftKey);

    return await this.getAttackCheck({
      weaponId: weaponId,
      attackIdx: attackIdx,
      getOptions: getOptions,
    });
  }

  async getAttackCheck(inData) {
    // Get an attack check
    let attackCheck = await this.actor.getAttackCheck(inData);

    // Cancel if appropriate
    if (attackCheck.cancelled) {
      return;
    }

    // Get the localized label
    let localizedLabel = game.i18n.localize(
      CONFIG.TITAN.attribute.option[attackCheck.checkOptions.attribute].label
    );

    // Add the skill to the label if appropriate
    if (attackCheck.checkOptions.skill != "none") {
      localizedLabel =
        localizedLabel +
        " (" +
        game.i18n.localize(
          CONFIG.TITAN.skill.option[attackCheck.checkOptions.skill].label
        ) +
        ")";
    }

    // Evaluate the check
    await attackCheck.check.evaluateCheck();

    // Post the check to chat
    await attackCheck.check.toChatMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      label: localizedLabel,
      attackName: attackCheck.checkOptions.attack.name,
      weaponName: attackCheck.checkOptions.weapon.name,
      type: attackCheck.checkOptions.attack.type,
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
    const resource =
      this.object.system.resources[event.target.dataset.resource];
    const newValue = event.target.value;

    if (newValue > resource.maxValue) {
      event.target.value = resource.maxValue;
    } else if (newValue < 0) {
      event.target.value = 0;
    }

    return;
  }

  async _onSkillEdit(event) {
    // Ensure the skill is within a valid range
    const newValue = event.target.value;

    // Cap the training values within range
    if (event.target.dataset.skillType == "training") {
      const maxSkillTraining = CONFIG.TITAN.skill.training.max;
      if (newValue > maxSkillTraining) {
        event.target.value = maxSkillTraining;
      } else if (newValue < 0) {
        event.target.value = 0;
      }
    } else {
      const maxSkillExpertise = CONFIG.TITAN.skill.expertise.max;
      if (newValue > maxSkillExpertise) {
        event.target.value = maxSkillExpertise;
      } else if (newValue < 0) {
        event.target.value = 0;
      }
    }

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
    const item = this.actor.items.get(itemId);
    item.delete();

    // Delete the entries from the expanded array
    delete this.isExpanded["inventory" + itemId];
    delete this.isExpanded["actions" + itemId];

    return;
  }

  /**
   * This is a temp override until foundry fixes its bug
   */
  _onSortItem(event, itemData) {
    // Get the drag source and drop target
    const items = this.actor.items;
    const source = items.get(itemData._id);
    const dropTarget = event.target.closest("[data-item-id]");
    const target = items.get(dropTarget.dataset.itemId);

    // Don't sort on yourself
    if (source.id === target.id) return;

    // Identify sibling items based on adjacent HTML elements
    const siblings = [];
    for (let el of dropTarget.parentElement.children) {
      const siblingId = el.dataset.itemId;
      if (siblingId && siblingId !== source.id)
        siblings.push(items.get(el.dataset.itemId));
    }

    // Perform the sort
    const sortUpdates = SortingHelpers.performIntegerSort(source, {
      target,
      siblings,
    });
    const updateData = sortUpdates.map((u) => {
      const update = u.update;
      update._id = u.target._id;
      return update;
    });

    // Perform the update
    return this.actor.updateEmbeddedDocuments("Item", updateData);
  }
}
