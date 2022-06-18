import { TITAN } from "../helpers/config.mjs";

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

    // Initiative = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    data.derivedStats.initiative.value =
      data.attributes.mind.baseValue +
      data.attributes.mind.staticMod +
      data.skills.dexterity.training.baseValue +
      data.skills.dexterity.training.staticMod +
      data.skills.perception.training.baseValue +
      data.skills.perception.training.staticMod +
      data.derivedStats.initiative.staticMod;

    // Awareness = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    data.derivedStats.awareness.value =
      Math.ceil(
        (data.attributes.mind.baseValue +
          data.attributes.mind.staticMod +
          data.skills.perception.training.baseValue +
          data.skills.perception.training.staticMod) /
          2
      ) + data.derivedStats.awareness.staticMod;

    // Defense = (Body + Training in Dexterity) / 2 rounded up (+ Mod)
    data.derivedStats.defense.value =
      Math.ceil(
        (data.attributes.body.baseValue +
          data.attributes.body.staticMod +
          data.skills.dexterity.training.baseValue +
          data.skills.dexterity.training.staticMod) /
          2
      ) + data.derivedStats.defense.staticMod;

    // Accuracy = (Mind + Training in Ranged Weapons) / 2 rounded up (+ Mod)
    data.derivedStats.accuracy.value =
      Math.ceil(
        (data.attributes.mind.baseValue +
          data.attributes.mind.staticMod +
          data.skills.rangedWeapons.training.baseValue +
          data.skills.rangedWeapons.training.staticMod) /
          2
      ) + data.derivedStats.accuracy.staticMod;

    // Calculate derived stats
    // Melee = (Body + Training in Melee Weapons) / 2 rounded up (+ Mod)
    data.derivedStats.melee.value =
      Math.ceil(
        (data.attributes.body.baseValue +
          data.attributes.body.staticMod +
          data.skills.meleeWeapons.training.baseValue +
          data.skills.meleeWeapons.training.staticMod) /
          2
      ) + data.derivedStats.melee.staticMod;
  }

  /**
   * Prepare Player type specific data
   */
  _preparePlayerData(actorData) {
    // Prepare template data
    this._prepareCharacterData(actorData);

    // Make modifications to data here. For example:
    const data = actorData.data;

    // Calculate the amount of EXP spent and the max Stamina
    let spentExp = 0;
    let totalAttributeValue = 0;

    // Add cost of current attributes
    for (const attribute in data.attributes) {
      let attributeValue = data.attributes[attribute].baseValue;

      // Calculate stamina
      totalAttributeValue = totalAttributeValue + attributeValue;

      // Calculate xp cost
      // Attributes
      if (attributeValue > TITAN.attributes.min) {
        spentExp =
          spentExp +
          TITAN.attributes.totalExpCostByRank[
            attributeValue - TITAN.attributes.min - 1
          ];
      }
    }

    data.exp.available = data.exp.earned - spentExp;

    // Calculate max stamina
    let maxStaminaBase = totalAttributeValue * TITAN.resources.maxStaminaMulti;
    data.resources.stamina.maxBase = totalAttributeValue * maxStaminaBase;
    data.resources.stamina.maxValue = maxStaminaBase;

    // Calculate max resolve
    let maxResolveBase = Math.ceil(data.attributes.soul.baseValue / 2);
    console.log(maxResolveBase);
    data.resources.resolve.maxBase = maxResolveBase;
    data.resources.resolve.maxValue = maxResolveBase;

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
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== "npc") return;

    // Process additional NPC data here.
  }

  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
  }
}
