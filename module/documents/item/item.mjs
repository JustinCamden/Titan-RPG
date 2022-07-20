import { TitanArmor } from "./armor.mjs";
import { TitanSpell } from "./spell.mjs";
import { TitanWeapon } from "./weapon.mjs";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TitanItem extends Item {
  constructor(data, context) {
    super(data, context);

    // Add components for handling type specific data
    switch (this.type) {
      // Weapon
      case "weapon": {
        this.weapon = new TitanWeapon(this);
        break;
      }

      // Armor
      case "armor": {
        this.armor = new TitanArmor(this);
        break;
      }

      // Spell
      case "spell": {
        this.spell = new TitanSpell(this);
      }

      default: {
        break;
      }
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
        "systems/titan/templates/item/item-trait-select-dialog.hbs",
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
      img: this.img,
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
          user: inData?.user ? inData.user : game.user.id,
          speaker: inData?.speaker,
          content: chatContent,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          sound: CONFIG.sounds.notification,
        },
        inData?.rollMode
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
        break;
      }

      // Armor
      case "armor": {
        return "systems/titan/templates/item/armor/armor-chat-message.hbs";
        break;
      }

      // Spell
      case "spell": {
        return "systems/titan/templates/item/spell/spell-chat-message.hbs";
        break;
      }

      // Default
      default: {
        return;
        break;
      }
    }
  }
}
