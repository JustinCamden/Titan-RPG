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

    // Calculate ability mods
    for (let [k, v] of Object.entries(data.attributes)) {
      data.attributes[k].value = v.baseValue + v.staticMod;
    }

    // Calculate the total attribute value
    let totalBaseAttributeValue = 0;
    for (const attribute in data.attributes) {
      totalBaseAttributeValue =
        totalBaseAttributeValue + data.attributes[attribute].baseValue;
    }

    // Calculate derived stats
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

    // Reflexes = (Mind + (Body/2))
    data.resistances.reflexes.baseValue =
      data.attributes.mind.value + Math.ceil(data.attributes.body.value / 2);
    data.resistances.reflexes.value =
      data.resistances.reflexes.baseValue + data.resistances.reflexes.staticMod;

    // Resilience = (Body + (Soul/2))
    data.resistances.resilience.baseValue =
      data.attributes.body.value + Math.ceil(data.attributes.soul.value / 2);
    data.resistances.resilience.value =
      data.resistances.resilience.baseValue +
      data.resistances.resilience.staticMod;

    // Willpower = (Soul + (Mind/2))
    data.resistances.willpower.baseValue =
      data.attributes.soul.value + Math.ceil(data.attributes.mind.value / 2);
    data.resistances.willpower.value =
      data.resistances.willpower.baseValue +
      data.resistances.willpower.staticMod;

    // Calculate max stamina
    let maxStaminaBase =
      totalBaseAttributeValue *
      CONFIG.TITAN.settings.resources.stamina.maxBaseMulti;
    data.resources.stamina.maxBase = maxStaminaBase;
    data.resources.stamina.maxValue =
      maxStaminaBase + data.resources.stamina.staticMod;

    // Calculate max resolve
    let maxResolveBase = Math.ceil(
      (data.attributes.soul.baseValue *
        CONFIG.TITAN.settings.resources.resolve.maxBaseMulti) /
        2
    );
    data.resources.resolve.maxBase = maxResolveBase;
    data.resources.resolve.maxValue =
      maxResolveBase + data.resources.resolve.staticMod;

    // Calculate max wounds
    let maxWoundsBase = Math.ceil(
      (totalBaseAttributeValue *
        CONFIG.TITAN.settings.resources.wounds.maxBaseMulti) /
        2
    );
    data.resources.wounds.maxBase = maxWoundsBase;
    data.resources.wounds.maxValue =
      maxWoundsBase + data.resources.wounds.staticMod;

    // Calculate skill mods
    for (let [k, v] of Object.entries(data.skills)) {
      data.skills[k].training.value =
        v.training.baseValue + v.training.staticMod;
      data.skills[k].expertise.value =
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
      const minAttributeValue = CONFIG.TITAN.settings.attributes.min;
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

  async getResistanceCheck(inData) {
    // If the resistance key is valid
    const resistanceData = this.data.data.resistances[inData.resistance];
    if (resistanceData) {
      // Calculate the resistance mod
      const resistanceMod = resistanceData.value;

      // Perform the roll
      const resistanceCheck = new Check({
        numberOfDice: resistanceMod,
        difficulty: inData.difficulty ? inData.difficulty : 4,
        complexity: inData.complexity ? inData.complexity : 0,
      });

      // Return the data
      const retVal = {
        check: resistanceCheck,
        resistanceMod: resistanceMod,
      };

      return retVal;
    }

    return null;
  }

  async getInitiativeRoll(inData) {
    // Calculate the initiative value
    const initiative = this.data.data.derivedStats.initiative.value;
    const roll = new Roll(
      "2d6+" +
        initiative.toString() +
        (inData != undefined && inData.bonus != undefined
          ? inData.bonus.toString()
          : "")
    );
    const retVal = {
      outRoll: roll,
      outInitiativeMod: initiative,
    };

    return retVal;
  }

  async getBasicCheck(inData) {
    // Get a check from the actor
    let checkOptions = {
      attribute: inData?.attribute ? inData.attribute : "body",
      skill: inData?.skill ? inData.skill : "athletics",
      difficulty: inData?.difficulty ? inData.difficulty : 4,
      complexity: inData?.complexity ? inData.complexity : 0,
      diceMod: inData?.diceMod ? inData.diceMod : 0,
      expertiseMod: inData?.expertiseMod ? inData.expertiseMod : 0,
      getOptions: inData?.getOptions ? inData.getOptions : false,
    };

    // Check if the attribute is the default attribute
    if (checkOptions.attribute == "default") {
      // Ensure the attribute is set
      checkOptions.attribute =
        this.data.data.skills[checkOptions.skill].defaultAttribute;
    }

    // Get options?
    if (checkOptions.getOptions) {
      // Initialize dialog data
      let dialogData = {
        attribute: checkOptions.attribute,
        skill: checkOptions.skill,
        difficulty: checkOptions.difficulty,
        complexity: checkOptions.complexity,
        diceMod: checkOptions.diceMod,
        expertiseMod: checkOptions.expertiseMod,
        attributes: {},
        skills: {},
      };

      // Add each attribute as an option to the data
      for (let [k, v] of Object.entries(this.data.data.attributes)) {
        dialogData.attributes[k] = k.toString();
      }

      // Add each skill as an option to the data
      for (let [k, v] of Object.entries(this.data.data.skills)) {
        dialogData.skills[k] = k.toString();
      }

      // Create the html template
      const html = await renderTemplate(
        "systems/titan/templates/checks/check-basic-dialog.hbs",
        dialogData
      );

      // Create the dialog
      checkOptions = await new Promise((resolve) => {
        const data = {
          title: game.i18n.localize(CONFIG.TITAN.local.check),
          content: html,
          buttons: {
            roll: {
              label: game.i18n.localize(CONFIG.TITAN.local.roll),
              callback: (html) =>
                resolve(
                  this._processBasicCheckOptions(html[0].querySelector("form"))
                ),
            },
            cancel: {
              label: game.i18n.localize(CONFIG.TITAN.local.cancel),
              callback: (html) => resolve({ cancelled: true }),
            },
          },
          default: "roll",
          close: () => resolve({ cancelled: true }),
        };

        new Dialog(data, null).render(true);
      });

      // Return if we canceled the check
      if (checkOptions.canceled) {
        return checkOptions;
      }
    }

    // Create the check parameters
    let checkParameters = {
      numberOfDice:
        this.data.data.attributes[checkOptions.attribute].value +
        checkOptions.diceMod,
      expertise: checkOptions.expertiseMod,
      difficulty: checkOptions.difficulty,
      complexity: checkOptions.complexity,
    };

    // Calculate the skill mod
    if (checkOptions.skill != "none") {
      const skillData = this.data.data.skills[checkOptions.skill];

      // Training
      checkParameters.numberOfDice =
        checkParameters.numberOfDice + skillData.training.value;

      // Expertise
      checkParameters.expertise =
        checkParameters.expertise + skillData.expertise.value;
    }

    // Perform the roll
    const check = new Check(checkParameters);

    // Return the data
    return {
      check: check,
      checkOptions: checkOptions,
      checkParameters: checkParameters,
    };
  }

  // Process check dialog results
  _processBasicCheckOptions(form) {
    return {
      attribute: form.attribute.value,
      skill: form.skill.value,
      difficulty: parseInt(form.difficulty.value),
      complexity: 0,
      diceMod: 0,
      expertiseMod: 0,
    };
  }
}
