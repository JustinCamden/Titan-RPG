import { TitanTypeComponent } from "./type-component.mjs";

export class TitanArmor extends TitanTypeComponent {
  getChatTemplate() {
    return "systems/titan/templates/item/spell/spell-chat-message.hbs";
  }

  async editArmorTraits() {
    // Get the trait options
    let traits = this.parent.system.traits;
    const traitData = {
      traitOptions: deepClone(CONFIG.TITAN.armor.trait.option),
      currentTraits: traits,
      label: this.name,
    };

    // Edit the traits in the traits dialog
    const newTraits = await this.parent._editTraits(traitData);

    // Edit the traits if appropriate
    if (!newTraits.cancelled) {
      // Add the traits to the attack
      traits = newTraits;

      // Update the item
      this.parent.update({
        system: {
          traits: traits,
        },
      });
    }
    return;
  }
}
