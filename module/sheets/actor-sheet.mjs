import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";
import { TitanActor } from "../documents/actor.mjs";

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
          initial: "skills",
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/titan/templates/actor/actor-${this.actor.data.type}-sheet.hbs`;
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
    const actorData = this.actor.data.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = actorData.data;
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
    const gear = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === "item") {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === "feature") {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === "spell") {
        if (i.data.spellLevel != undefined) {
          spells[i.data.spellLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find(".item-edit").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find(".item-create").click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find(".item-delete").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html
      .find(".effect-control")
      .click((ev) => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find(".rollable").click(this._onRoll.bind(this));

    // Editing attributes
    html.find(".attribute-edit").change(this._onAttributeEdit.bind(this));

    // Editing resources
    html.find(".resource-edit").change(this._onResourceEdit.bind(this));

    // Editing skills
    html.find(".skill-edit").change(this._onSkillEdit.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find("li.item").each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
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

        // Attribute rolls
        case "attribute": {
          this.getBasicCheck({
            attribute: dataset.rollAttribute,
            skill: "none",
          });
          break;
        }

        // Skill rolls
        case "skill": {
          this.getBasicCheck({
            skill: dataset.rollSkill,
            attribute: "default",
            getOptions: true,
          });

          break;
        }

        // Resistance rolls
        case "resistance": {
          // Check if the data is valid
          const rollresistance = dataset.rollResistance;
          if (rollresistance) {
            // Get the roll from the actor
            const resistanceCheck = await this.actor.getResistanceCheck({
              resistance: rollresistance,
            });

            // Create a localized label
            const localizedLabel = game.i18n.localize(
              CONFIG.TITAN.local.resistances[rollresistance]
            );

            // Evaluate the check
            await resistanceCheck.check.evaluateCheck();

            // Post the check to chat
            await resistanceCheck.check.toChatMessage({
              user: game.user.id,
              speaker: ChatMessage.getSpeaker({ actor: this.actor }),
              label: localizedLabel,
              rollMode: game.settings.get("core", "rollMode"),
            });
          }

          break;
        }

        // Initiative rolls
        case "initiative": {
          // Get the roll from the actor
          const rollResult = await this.actor.getInitiativeRoll();
          if (rollResult) {
            // Output the roll
            const roll = rollResult.outRoll;
            const localizedLabel = game.i18n.localize(
              CONFIG.TITAN.local.derivedStats.initiative.name
            );
            roll.toMessage({
              speaker: ChatMessage.getSpeaker({ actor: this.actor }),
              flavor: localizedLabel,
              rollMode: game.settings.get("core", "rollMode"),
            });

            return roll;
          }
        }

        default: {
          return null;
          break;
        }
      }
    }
  }

  async getBasicCheck(inData) {
    // Get a check from the actor
    let basicCheck = await this.actor.getBasicCheck({
      attribute: inData?.attribute ? inData.attribute : "body",
      skill: inData?.skill ? inData.skill : "athletics",
      difficulty: inData?.difficulty ? inData.difficulty : 4,
      complexity: inData?.complexity ? inData.complexity : 0,
      diceMod: inData?.diceMod ? inData.diceMod : 0,
      expertiseMod: inData?.expertiseMod ? inData.expertiseMod : 0,
      getOptions: inData?.getOptions ? inData.getOptions : false,
    });
    console.log(inData);
    if (basicCheck.cancelled) {
      return;
    }

    // Get the localized label
    let localizedLabel = game.i18n.localize(
      CONFIG.TITAN.local.attributes[basicCheck.checkOptions.attribute]
    );

    // Add the skill to the label if appropriate
    if (basicCheck.checkOptions.skill != "none") {
      localizedLabel =
        localizedLabel +
        " (" +
        game.i18n.localize(
          CONFIG.TITAN.local.skills[basicCheck.checkOptions.skill]
        ) +
        ")";
    }

    // Evaluate the check
    await basicCheck.check.evaluateCheck();

    // Post the check to chat
    await basicCheck.check.toChatMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      label: localizedLabel,
      rollMode: game.settings.get("core", "rollMode"),
    });
    return;
  }

  async _onAttributeEdit(event) {
    // Ensure the attribute is within a valid range
    const newValue = event.target.value;

    const maxAttributeValue = CONFIG.TITAN.attributes.settings.max;
    if (newValue > maxAttributeValue) {
      event.target.value = maxAttributeValue;
    } else {
      const minAttributeValue = CONFIG.TITAN.attributes.settings.min;
      if (newValue < minAttributeValue) {
        event.target.value = CONFIG.TITAN.attributes.settings.min;
      }
    }

    return;
  }

  async _onResourceEdit(event) {
    // Ensure the resource is within a valid range
    const resource =
      this.object.data.data.resources[event.target.dataset.resource];
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

    if (event.target.dataset.skillType == "training") {
      const maxSkillTraining = CONFIG.TITAN.skills.training.max;
      if (newValue > maxSkillTraining) {
        event.target.value = maxSkillTraining;
      } else if (newValue < 0) {
        event.target.value = 0;
      }
    } else {
      const maxSkillExpertise = CONFIG.TITAN.skills.expertise.max;
      if (newValue > maxSkillExpertise) {
        event.target.value = maxSkillExpertise;
      } else if (newValue < 0) {
        event.target.value = 0;
      }
    }

    return;
  }
}
