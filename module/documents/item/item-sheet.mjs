import { TITAN } from "../../helpers/config.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class TitanItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["titan", "sheet", "item"],
      width: 780,
      height: 620,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
      scrollY: [".scrolling"],
    });
  }

  /** @override */
  get template() {
    const path = `systems/titan/templates/item/${this.item.type}`;
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = this.item.toObject(false);

    // Add the items's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add item rarity options
    context.rarityOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.item.rarity.option)) {
      context.rarityOptions[k] = v.label;
    }

    // Add type specific options
    context.type;
    if (context.item.type == "weapon") {
      // Attack type
      context.attackTypeOptions = {};
      for (let [k, v] of Object.entries(CONFIG.TITAN.attack.type.option)) {
        context.attackTypeOptions[k] = v.label;
      }

      // Attack range
      context.meleeRangeOptions = {
        close: "TITAN.range.option.close.label",
        short: "TITAN.range.option.short.label",
      };
      context.rangedRangeOptions = {
        short: "TITAN.range.option.short.label",
        medium: "TITAN.range.option.medium.label",
        long: "TITAN.range.option.long.label",
        extreme: "TITAN.range.option.extreme.label",
      };

      // Attributes
      context.attributeOptions = {};
      for (let [k, v] of Object.entries(CONFIG.TITAN.attribute.option)) {
        context.attributeOptions[k] = v.label;
      }

      // Skills
      context.skillOptions = {};
      for (let [k, v] of Object.entries(CONFIG.TITAN.skill.option)) {
        context.skillOptions[k] = v.label;
      }
    }

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. go here.
    switch (this.item.type) {
      // Weapon listeners
      case "weapon": {
        html
          .find(".edit-attack-name")
          .change(this._onEditAttackName.bind(this));

        html
          .find(".select-attack-type")
          .change(this._onSelectAttackType.bind(this));

        html
          .find(".select-attack-range")
          .change(this._onSelectAttackRange.bind(this));

        html
          .find(".select-attack-attribute")
          .change(this._onSelectAttackAttribute.bind(this));

        html
          .find(".select-attack-skill")
          .change(this._onSelectAttackSkill.bind(this));

        html
          .find(".edit-attack-damage")
          .change(this._onEditAttackDamage.bind(this));

        html
          .find(".edit-attack-traits")
          .click(this._onEditAttackTraits.bind(this));

        html.find(".add-attack").click(this._onAddAttack.bind(this));

        html.find(".delete-attack").click(this._onDeleteAttack.bind(this));

        break;
      }

      default: {
        break;
      }
    }
  }

  async _onEditAttackName(event) {
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.system.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.system.attack;

      // Update the attack damage
      attack[idx].name = event.target.value;
      this.item.update({
        system: { attack: attack },
      });
    }
    return;
  }

  async _onSelectAttackType(event) {
    event.preventDefault();
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.system.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.system.attack;

      // Update the atttack type
      attack[idx].type = event.target.value;

      // If switching to melee to ranged
      if (attack[idx].type == "melee") {
        // Set the range to close
        attack[idx].range = "close";

        // Update the attribute and skill if neither are overridden
        if (
          attack[idx].attribute == "mind" &&
          attack[idx].skill == "rangedWeapons"
        ) {
          // Set melee defaults
          attack[idx].attribute = "body";
          attack[idx].skill = "meleeWeapons";
        }
        // Else, if switching to ranged from melee defaults
      } else {
        // Set the range to medium
        attack[idx].range = "medium";

        // Update the attribute and skill if neither are overridden
        if (
          attack[idx].attribute == "body" &&
          attack[idx].skill == "meleeWeapons"
        ) {
          // Set ranged defaults
          attack[idx].attribute = "mind";
          attack[idx].skill = "rangedWeapons";
        }
      }

      this.item.update({
        system: { attack: attack },
      });
    }
    return;
  }

  async _onSelectAttackRange(event) {
    event.preventDefault();
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.system.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.system.attack;

      // Update the attack range
      attack[idx].range = event.target.value;
      this.item.update({
        system: { attack: attack },
      });
    }
    return;
  }

  async _onSelectAttackAttribute(event) {
    event.preventDefault();
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.system.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.system.attack;

      // Update the attack attribute
      attack[idx].attribute = event.target.value;
      this.item.update({
        system: { attack: attack },
      });
    }
    return;
  }

  async _onSelectAttackSkill(event) {
    event.preventDefault();
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.system.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.system.attack;

      // Update the attack skill
      attack[idx].skill = event.target.value;
      this.item.update({
        system: { attack: attack },
      });
    }
    return;
  }

  async _onEditAttackDamage(event) {
    event.preventDefault();
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.system.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.system.attack;

      // Update the attack damage
      attack[idx].damage = event.target.value;
      this.item.update({
        system: { attack: attack },
      });
    }
    return;
  }

  async _onEditAttackTraits(event) {
    event.preventDefault();
    this.item.weapon.editAttackTraits(event.target.dataset.idx);
    return;
  }

  async _onAddAttack(event) {
    console.log("HEre");
    event.preventDefault();
    console.log(this.item.weapon);
    this.item.weapon.addAttack();
    return;
  }

  async _onDeleteAttack(event) {
    event.preventDefault();
    this.item.weapon.deleteAttack(event.target.dataset.idx);
    return;
  }
}
