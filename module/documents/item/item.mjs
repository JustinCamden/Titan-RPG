import { TitanWeapon } from "./weapon.mjs";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TitanItem extends Item {
  constructor(data, context) {
    super(data, context);
    switch (this.type) {
      case "weapon": {
        this.weapon = new TitanWeapon(this);
        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    // If present, return the actor's roll data.
    if (!this.actor) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get("core", "rollMode");
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: this.system.description ?? "",
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.item.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }

  async _editTraits(inData) {
    // If the trait options are valid
    if (inData?.traitOptions) {
      // Initialize the dialog data
      let dialogData = {
        traitOptions: inData.traitOptions,
      };
      const currentTraits = inData.currentTraits;

      // For each trait option
      if (currentTraits) {
        for (let idx = 0; idx < currentTraits.length; idx++) {
          // Get the name of the trait
          const name = currentTraits[idx].name;

          // Set the number value of the trait if appropriate
          if (currentTraits[idx].numberValue > 0) {
            dialogData.traitOptions[name].numberValue =
              currentTraits[idx].numberValue;
          }

          // Otherwise, set the trait to active
          else {
            dialogData.traitOptions[name].isTraitActive = true;
          }
        }
      }

      // Create the html template
      const html = await renderTemplate(
        "systems/titan/templates/item/item-trait-dialog.hbs",
        dialogData
      );

      // Create the dialog
      return await new Promise((resolve) => {
        const data = {
          title:
            game.i18n.localize(CONFIG.TITAN.trait.edit.label) +
            " (" +
            this.name +
            (inData.label ? ": " + inData.label : "") +
            ")",
          content: html,
          buttons: {
            save: {
              label: game.i18n.localize(CONFIG.TITAN.save.label),
              callback: (html) =>
                resolve(
                  this._processEditTraits({
                    form: html[0].querySelector("form"),
                    traitOptions: dialogData.traitOptions,
                  })
                ),
            },
            cancel: {
              label: game.i18n.localize(CONFIG.TITAN.cancel.label),
              callback: (html) => resolve({ cancelled: true }),
            },
          },
          default: "save",
          close: () => resolve({ cancelled: true }),
        };

        const dialogOptions = {
          width: 500,
        };

        new Dialog(data, dialogOptions).render(true);
      });
    }

    return;
  }

  _processEditTraits(inData) {
    let retVal = [];

    // For each trait
    for (let [k, v] of Object.entries(inData.traitOptions)) {
      // If this is a trait with a number value
      if (v.numberValue > -1) {
        // If the number is > 0
        let numberValue = parseInt(
          inData.form[k.toString() + ".numberValue"].value
        );
        if (numberValue > 0) {
          // Prepare the trait
          let trait = {
            name: k.toString(),
            numberValue: numberValue,
          };

          // Add the trait to retVal
          retVal.push(trait);
        }
      }

      // Otherwise, if the trait is checked as active
      if (inData.form[k.toString() + ".isTraitActive"]?.checked) {
        // Prepare the trait
        let trait = {
          name: k.toString(),
        };

        // Add the trait to the retval
        retVal.push(trait);
      }
    }

    return retVal;
  }

  getCheckData() {
    const systemData = this.system;
    return systemData;
  }

  async sendToChat(inData) {
    // Setup the data to display
    // Create the html
    const messageData = {
      system: this.system,
      name: this.name,
    };
    const chatContent = await renderTemplate(
      this._getChatTemplate(),
      messageData
    );

    // Create and post the message
    const messageClass = getDocumentClass("ChatMessage");
    this.chatMessage = messageClass.create(
      messageClass.applyRollMode(
        {
          user: inData.user ? inData.user : game.user.id,
          speaker: inData.speaker,
          content: chatContent,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          sound: CONFIG.sounds.notification,
        },
        inData.rollMode
          ? inData.rollMode
          : game.settings.get("core", "rollMode")
      )
    );

    return this.chatMessage;
  }

  // Gets the chat template for the item
  _getChatTemplate() {
    switch (this.type) {
      // Weapon
      case "weapon": {
        return "systems/titan/templates/item/weapon/weapon-chat-message.hbs";
      }

      // Default
      default: {
        return;
      }
    }
  }
}
