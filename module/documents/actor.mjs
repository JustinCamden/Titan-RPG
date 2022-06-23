import Check from "../helpers/check.mjs";

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
    data.derivedStats.initiative.baseValue =
      data.attributes.mind.baseValue +
      data.attributes.mind.staticMod +
      data.skills.dexterity.training.baseValue +
      data.skills.dexterity.training.staticMod +
      data.skills.perception.training.baseValue +
      data.skills.perception.training.staticMod;
    data.derivedStats.initiative.value =
      data.derivedStats.initiative.baseValue +
      data.derivedStats.initiative.staticMod;

    // Awareness = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    data.derivedStats.awareness.baseValue = Math.ceil(
      (data.attributes.mind.baseValue +
        data.attributes.mind.staticMod +
        data.skills.perception.training.baseValue +
        data.skills.perception.training.staticMod) /
        2
    );
    data.derivedStats.awareness.value =
      data.derivedStats.awareness.baseValue +
      data.derivedStats.awareness.staticMod;

    // Defense = (Body + Training in Dexterity) / 2 rounded up (+ Mod)
    data.derivedStats.defense.baseValue = Math.ceil(
      (data.attributes.body.baseValue +
        data.attributes.body.staticMod +
        data.skills.dexterity.training.baseValue +
        data.skills.dexterity.training.staticMod) /
        2
    );
    data.derivedStats.defense.value =
      data.derivedStats.defense.baseValue + data.derivedStats.defense.staticMod;

    // Accuracy = (Mind + Training in Ranged Weapons) / 2 rounded up (+ Mod)
    data.derivedStats.accuracy.baseValue = Math.ceil(
      (data.attributes.mind.baseValue +
        data.attributes.mind.staticMod +
        data.skills.rangedWeapons.training.baseValue +
        data.skills.rangedWeapons.training.staticMod) /
        2
    );
    data.derivedStats.accuracy.value =
      data.derivedStats.accuracy.baseValue +
      data.derivedStats.accuracy.staticMod;

    // Calculate derived stats
    // Melee = (Body + Training in Melee Weapons) / 2 rounded up (+ Mod)
    data.derivedStats.melee.baseValue = Math.ceil(
      (data.attributes.body.baseValue +
        data.attributes.body.staticMod +
        data.skills.meleeWeapons.training.baseValue +
        data.skills.meleeWeapons.training.staticMod) /
        2
    );
    data.derivedStats.melee.value =
      data.derivedStats.melee.baseValue + data.derivedStats.melee.staticMod;

    // Calculate the total attribute value
    let totalBaseAttributeValue = 0;
    for (const attribute in data.attributes) {
      totalBaseAttributeValue =
        totalBaseAttributeValue + data.attributes[attribute].baseValue;
    }

    // Calculate max stamina
    let maxStaminaBase =
      totalBaseAttributeValue * CONFIG.TITAN.resources.stamina.maxBaseMulti;
    data.resources.stamina.maxBase = maxStaminaBase;
    data.resources.stamina.maxValue =
      maxStaminaBase + data.resources.stamina.staticMod;

    // Calculate max resolve
    let maxResolveBase = Math.ceil(data.attributes.soul.baseValue / 2);
    data.resources.resolve.maxBase = maxResolveBase;
    data.resources.resolve.maxValue =
      maxResolveBase + data.resources.resolve.staticMod;

    // Calculate max wounds
    let maxWoundsBase = Math.ceil(
      (totalBaseAttributeValue * CONFIG.TITAN.resources.wounds.maxBaseMulti) / 2
    );
    data.resources.wounds.maxBase = maxWoundsBase;
    data.resources.wounds.maxValue =
      maxWoundsBase + data.resources.wounds.staticMod;

    // Calculate ability mods
    for (let [k, v] of Object.entries(data.attributes)) {
      data.attributes[k].value = v.baseValue + v.staticMod;
    }

    // Calculate skill mods
    for (let [k, v] of Object.entries(data.skills)) {
      data.skills[k].training.value =
        v.training.baseValue + v.training.staticMod;
      data.skills[k].expertise.value =
        v.expertise.baseValue + v.expertise.staticMod;
    }

    // Calculate resilience mods
    for (let [k, v] of Object.entries(data.resiliences)) {
      data.resiliences[k].training.value =
        v.training.baseValue + v.training.staticMod;
      data.resiliences[k].expertise.value =
        v.expertise.baseValue + v.expertise.staticMod;
    }
  }

  /**
   * Prepare Player type specific data
   */
  _preparePlayerData(actorData) {
    // Prepare template data
    this._prepareCharacterData(actorData);

    // Make modifications to data here.
    const data = actorData.data;

    // Calculate the amount of EXP spent
    let spentExp = 0;

    // Add cost of current attributes
    for (const attribute in data.attributes) {
      const attributeBaseValue = data.attributes[attribute].baseValue;

      // Calculate xp cost
      const minAttributeValue = CONFIG.TITAN.attributes.min;
      if (attributeBaseValue > minAttributeValue) {
        spentExp =
          spentExp +
          CONFIG.TITAN.attributes.totalExpCostByRank[
            attributeBaseValue - minAttributeValue - 1
          ];
      }
    }

    // Add cost of current skills
    for (const skill in data.skills) {
      const skillData = data.skills[skill];

      // Calculate xp cost of training
      const skillTrainingBaseValue = skillData.training.baseValue;
      if (skillTrainingBaseValue > 0) {
        spentExp =
          spentExp +
          CONFIG.TITAN.skills.training.totalExpCostByRank[
            skillTrainingBaseValue - 1
          ];
      }

      // Calculate xp cost of training
      const skillExpertiseBaseValue = skillData.expertise.baseValue;
      if (skillExpertiseBaseValue > 0) {
        spentExp =
          spentExp +
          CONFIG.TITAN.skills.expertise.totalExpCostByRank[
            skillExpertiseBaseValue - 1
          ];
      }
    }

    // Add cost of current resiliences
    for (const resilience in data.resiliences) {
      const resilienceData = data.resiliences[resilience];

      // Calculate xp cost of training
      const resilienceTrainingBaseValue = resilienceData.training.baseValue;
      if (resilienceTrainingBaseValue > 0) {
        spentExp =
          spentExp +
          CONFIG.TITAN.skills.training.totalExpCostByRank[
            resilienceTrainingBaseValue - 1
          ];
      }

      // Calculate xp cost of training
      const resilienceExpertiseBaseValue = resilienceData.expertise.baseValue;
      if (resilienceExpertiseBaseValue > 0) {
        spentExp =
          spentExp +
          CONFIG.TITAN.skills.expertise.totalExpCostByRank[
            resilienceExpertiseBaseValue - 1
          ];
      }
    }

    data.exp.available = data.exp.earned - spentExp;
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

  async getAttributeCheck(inData) {
    // If the attribute key is valid
    const attributeData = this.data.data.attributes[inData.attribute];
    if (attributeData) {
      // Calculate attribute mod
      const attributeMod = attributeData.value;

      // Perform the roll
      const attributeCheck = new Check({
        numberOfDice: attributeMod,
        difficulty: inData.difficulty ? inData.difficulty : 4,
        complexity: inData.complexity ? inData.complexity : 0,
      });

      // Return the data
      const retVal = {
        check: attributeCheck,
        attributeMod: attributeMod,
      };

      return retVal;
    }
  }

  async getSkillCheck(inData) {
    // If the skill key is valid
    const skillData = this.data.data.skills[inData.skill];
    if (skillData) {
      // Calculate the skill mod
      const skillTrainingMod = skillData.training.value;
      const skillExpertise = skillData.expertise.value;

      // Calculate the attribute mod
      const attributes = this.data.data.attributes;
      let attributeKey = inData.attribute;
      let attributeData = attributes[attributeKey];
      if (!attributeData) {
        attributeKey = skillData.defaultAttribute;
        attributeData = attributes[attributeKey];
      }
      const attributeMod = attributeData.value;

      // Perform the roll
      const skillCheck = new Check({
        numberOfDice: attributeMod + skillTrainingMod,
        expertise: skillExpertise,
        difficulty: inData.difficulty ? inData.difficulty : 4,
        complexity: inData.complexity ? inData.complexity : 0,
      });

      // Return the data
      const retVal = {
        check: skillCheck,
        training: skillTrainingMod,
        expertise: skillExpertise,
        attribute: attributeKey,
        attributeMod: attributeMod,
      };

      return retVal;
    }

    return null;
  }

  async getResilienceRoll(resilience, attribute, difficulty, bonusDie) {
    // If the resilience key is valid
    const resilienceData = this.data.data.resiliences[resilience];
    if (resilienceData) {
      // Calculate the resilience mod
      const resilienceTrainingMod = resilienceData.training.value;

      // Calculate the attribute mod
      const attributes = this.data.data.attributes;
      let attributeKey = attribute;
      let attributeData = attributes[attributeKey];
      if (!attributeData) {
        attributeKey = resilienceData.defaultAttribute;
        attributeData = attributes[attributeKey];
      }
      let attributeMod = attributeData.value;

      // Calculate the difficulty
      let rollDifficulty = difficulty;
      if (!rollDifficulty) {
        rollDifficulty = 4;
      }

      // Calculate the roll formula
      const rollFormula =
        ("(" + resilienceTrainingMod + "+" + attributeMod).toString() +
        (bonusDie ? "+" + bonusDie.toString() : "") +
        ")d6cs>=" +
        rollDifficulty.toString();

      // Perform the roll
      const roll = new Roll(rollFormula, this.getRollData());

      // Return the data
      const retVal = {
        outRoll: roll,
        outresilienceTrainingMod: resilienceTrainingMod,
        outAttribute: attributeKey,
        outAttributeMod: attributeMod,
      };

      return retVal;
    }

    return null;
  }

  async getInitiativeRoll(bonus) {
    // Calculate the initiative value
    const initiative = this.data.data.derivedStats.initiative.value;
    const roll = new Roll(
      "2d6+" + initiative.toString() + (bonus ? bonus.toString() : ""),
      this.getRollData()
    );
    const retVal = {
      outRoll: roll,
      outInitiativeMod: initiative,
    };

    return retVal;
  }
}
