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
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
    });
  }

  /** @override */
  get template() {
    const path = "systems/titan/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.data.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item.data;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = itemData.data;
    context.flags = itemData.flags;

    // Add item rarity options
    context.rarityOptions = {};
    for (let [k, v] of Object.entries(CONFIG.TITAN.local.item.rarity)) {
      context.rarityOptions[k] = v;
    }

    // Add weapon options
    if (itemData.type == "weapon") {
      // Attack type
      context.attackTypeOptions = {};
      for (let [k, v] of Object.entries(CONFIG.TITAN.local.attack.type)) {
        context.attackTypeOptions[k] = v;
      }

      // Attack type
      context.attackRangeOptions = {};
      for (let [k, v] of Object.entries(CONFIG.TITAN.local.range.option)) {
        context.attackRangeOptions[k] = v;
      }

      // Attributes
      context.attributeOptions = {};
      for (let [k, v] of Object.entries(CONFIG.TITAN.local.attribute)) {
        context.attributeOptions[k] = v;
      }

      // Skills
      context.skillOptions = {};
      for (let [k, v] of Object.entries(CONFIG.TITAN.local.skill)) {
        context.skillOptions[k] = v;
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

    // Roll handlers, click handlers, etc. would go here.
    html.find(".edit-attack-name").change(this._onEditAttackName.bind(this));

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
  }

  _onEditAttackName(event) {
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.data.data.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.data.data.attack;

      // Update the attack damage
      attack[idx].name = event.target.value;
      this.item.update({
        data: { attack: attack },
      });
    }
    return;
  }

  _onSelectAttackType(event) {
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.data.data.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.data.data.attack;

      // Update the atttack type
      attack[idx].type = event.target.value;

      // Update skill and attribute if appropriate
      // If switching to melee from defaults for ranged
      if (attack[idx].type == "melee") {
        if (
          attack[idx].attribute == "mind" &&
          attack[idx].skill == "rangedWeapons"
        ) {
          // Set melee defaults
          attack[idx].attribute = "body";
          attack[idx].skill = "meleeWeapons";
        }
        // Else, if switching to ranged from melee defaults
      } else if (
        attack[idx].attribute == "body" &&
        attack[idx].skill == "meleeWeapons"
      ) {
        // Set ranged defaults
        attack[idx].attribute = "mind";
        attack[idx].skill = "rangedWeapons";
      }

      this.item.update({
        data: { attack: attack },
      });
    }
    return;
  }

  _onSelectAttackRange(event) {
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.data.data.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.data.data.attack;

      // Update the attack range
      attack[idx].range = event.target.value;
      this.item.update({
        data: { attack: attack },
      });
    }
    return;
  }

  _onSelectAttackAttribute(event) {
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.data.data.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.data.data.attack;

      // Update the attack attribute
      attack[idx].attribute = event.target.value;
      this.item.update({
        data: { attack: attack },
      });
    }
    return;
  }

  _onSelectAttackSkill(event) {
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.data.data.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.data.data.attack;

      // Update the attack skill
      attack[idx].skill = event.target.value;
      this.item.update({
        data: { attack: attack },
      });
    }
    return;
  }

  _onEditAttackDamage(event) {
    // Check if the data is valid
    const idx = event.target.dataset.idx;
    if (this.item.data.data.attack[idx]) {
      // Copy the attacks array
      let attack = this.item.data.data.attack;

      // Update the attack damage
      attack[idx].damage = event.target.value;
      this.item.update({
        data: { attack: attack },
      });
    }
    return;
  }
}
