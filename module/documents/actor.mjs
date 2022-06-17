/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class TitanActor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of player sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.titan || {};

    // Make separate methods for each Actor type (player, npc, etc.) to keep
    // things organized.
    switch (actorData.type) {
      case "player": {
        this._preparePlayerData(actorData);
        break;
      }
      case "npc": {
        this._prepareNpcData(actorData);
        break;
      }
      default: {
        console.error("TITAN: Invalid actor type when preparing derived data.");
        break;
      }
    }
  }

  // Prepare Character type specific data
  _prepareCharacterData(actorData) {
    // Make modifications to data here. For example:
    const data = actorData.data;

    // Initiative = (Mind + Training in Awareness) / 2 rounded up (+ bonus)
    data.derivedStats.initiative.value =
      data.attributes.mind.baseValue +
      data.attributes.mind.staticBonus +
      data.skills.dexterity.training.baseValue +
      data.skills.dexterity.training.staticBonus +
      data.skills.perception.training.baseValue +
      data.skills.perception.training.staticBonus +
      data.derivedStats.initiative.staticBonus;

    // Awareness = (Mind + Training in Awareness) / 2 rounded up (+ bonus)
    data.derivedStats.awareness.value =
      Math.ceil(
        (data.attributes.mind.baseValue +
          data.attributes.mind.staticBonus +
          data.skills.perception.training.baseValue +
          data.skills.perception.training.staticBonus) /
          2
      ) + data.derivedStats.awareness.staticBonus;

    // Defense = (Body + Training in Dexterity) / 2 rounded up (+ bonus)
    data.derivedStats.defense.value =
      Math.ceil(
        (data.attributes.body.baseValue +
          data.attributes.body.staticBonus +
          data.skills.dexterity.training.baseValue +
          data.skills.dexterity.training.staticBonus) /
          2
      ) + data.derivedStats.defense.staticBonus;

    // Accuracy = (Mind + Training in Ranged Weapons) / 2 rounded up (+ bonus)
    data.derivedStats.accuracy.value =
      Math.ceil(
        (data.attributes.mind.baseValue +
          data.attributes.mind.staticBonus +
          data.skills.rangedWeapons.training.baseValue +
          data.skills.rangedWeapons.training.staticBonus) /
          2
      ) + data.derivedStats.accuracy.staticBonus;

    // Calculate derived stats
    // Melee = (Body + Training in Melee Weapons) / 2 rounded up (+ bonus)
    data.derivedStats.melee.value =
      Math.ceil(
        (data.attributes.body.baseValue +
          data.attributes.body.staticBonus +
          data.skills.meleeWeapons.training.baseValue +
          data.skills.meleeWeapons.training.staticBonus) /
          2
      ) + data.derivedStats.melee.staticBonus;
  }

  /**
   * Prepare Player type specific data
   */
  _preparePlayerData(actorData) {
    // Prepare template data
    this._prepareCharacterData(actorData);

    // Make modifications to data here. For example:
    const data = actorData.data;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    // Prepare template data
    this._prepareCharacterData(actorData);

    // Make modifications to data here. For example:
    const data = actorData.data;

    data.xp = data.cr * data.cr * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare player roll data.
    this._getPlayerRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare player roll data.
   */
  _getPlayerRollData(data) {
    if (this.data.type !== "player") return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== "npc") return;

    // Process additional NPC data here.
  }
}
