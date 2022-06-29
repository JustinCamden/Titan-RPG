/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TitanItem extends Item {
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
    rollData.item = foundry.utils.deepClone(this.data.data);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this.data;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get("core", "rollMode");
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.data.data.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.data.description ?? "",
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

  async editTags(inTags) {
    // If the tag options are valid is valid
    if (inData?.tagOptions) {
      // Initialize the dialog data
      let dialogData = {
        tagOptions: inData.tagOptions,
      };

      // For each tag option
      for (let [k, v] of Object.entries(inData.tagOptions)) {
        // Add the option to the list
        dialogData.tagOptions[k].label = v.label;

        // Set whether the tag is currently selected based on the current tags
        dialogData.tagOptions[k].selected =
          inData.currentTags && indata.currentTags[k] ? true : false;

        // Set whether the tag has an intValue
        const hasIntValue = inData.tagOptions[k].hasIntValue;
        dialogData.tagOptions[k].hasIntValue = hasIntValue;
        if (hasIntValue) {
          dialogData.tagOptions[k].intValue = indata.currentTags;
        }
      }

      // Create the html template
      const html = await renderTemplate(
        "systems/titan/templates/item/item-tag-dialog.hbs",
        dialogData
      );

      // Create the dialog
      let newTags = await new Promise((resolve) => {
        const data = {
          title: game.i18n.localize(CONFIG.TITAN.check.name),
          content: html,
          buttons: {
            save: {
              label: game.i18n.localize(CONFIG.TITAN.save.label),
              callback: (html) =>
                resolve(
                  this._processBasicCheckOptions(html[0].querySelector("form"))
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

        new Dialog(data, null).render(true);
      });
    }
  }
}
