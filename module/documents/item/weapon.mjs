export class TitanWeapon {
  constructor(parent) {
    this.parent = parent;
  }

  async editAttackTraits(idx) {
    // Check if the data is valid

    let attack = this.parent.system.attack;
    if (attack[idx]) {
      // Get the trait options
      const traitData = {
        traitOptions: deepClone(CONFIG.TITAN.attack.trait.option),
        currentTraits: attack[idx].traits,
        label: attack[idx].name,
      };

      // Edit the traits in the traits dialog
      const newTraits = await this.parent._editTraits(traitData);

      // Edit the traits if appropriate
      if (!newTraits.cancelled) {
        // Add the traits to the attack
        attack[idx].traits = newTraits;

        // Update the item
        this.parent.update({
          system: {
            attack: attack,
          },
        });
      }
    }

    return;
  }

  async addAttack() {
    console.log(this);
    // Create the new attack
    const newAttack = foundry.utils.deepClone(CONFIG.TITAN.attack.template);

    // Add the attack and update the item
    let attack = this.parent.system.attack;
    attack.push(newAttack);
    await this.parent.update({
      system: {
        attack: attack,
      },
    });

    return;
  }

  async deleteAttack(idx) {
    // Remove the attack and update the item
    let attack = this.parent.system.attack;
    attack.splice(idx, 1);

    // If we have no more attacks, ensure we have at least one
    if (attack.length <= 0) {
      this.addAttack();

      // Otherwise, update the item
    } else {
      await this.parent.update({
        system: {
          attack: attack,
        },
      });
    }

    return;
  }

  async;
}
