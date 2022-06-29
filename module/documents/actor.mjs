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
    for (let [k, v] of Object.entries(data.attribute)) {
      data.attribute[k].value = v.baseValue + v.staticMod;
    }

    // Calculate the total attribute value
    let totalBaseAttributeValue = 0;
    for (const attribute in data.attribute) {
      totalBaseAttributeValue =
        totalBaseAttributeValue + data.attribute[attribute].baseValue;
    }

    // Calculate derived stats
    // Initiative = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    data.derivedStats.initiative.baseValue =
      data.attribute.mind.baseValue +
      data.attribute.mind.staticMod +
      data.skill.dexterity.training.baseValue +
      data.skill.dexterity.training.staticMod +
      data.skill.perception.training.baseValue +
      data.skill.perception.training.staticMod;
    data.derivedStats.initiative.value =
      data.derivedStats.initiative.baseValue +
      data.derivedStats.initiative.staticMod;

    // Awareness = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    data.derivedStats.awareness.baseValue = Math.ceil(
      (data.attribute.mind.baseValue +
        data.attribute.mind.staticMod +
        data.skill.perception.training.baseValue +
        data.skill.perception.training.staticMod) /
        2
    );
    data.derivedStats.awareness.value =
      data.derivedStats.awareness.baseValue +
      data.derivedStats.awareness.staticMod;

    // Defense = (Body + Training in Dexterity) / 2 rounded up (+ Mod)
    data.derivedStats.defense.baseValue = Math.ceil(
      (data.attribute.body.baseValue +
        data.attribute.body.staticMod +
        data.skill.dexterity.training.baseValue +
        data.skill.dexterity.training.staticMod) /
        2
    );
    data.derivedStats.defense.value =
      data.derivedStats.defense.baseValue + data.derivedStats.defense.staticMod;

    // Accuracy = (Mind + Training in Ranged Weapons) / 2 rounded up (+ Mod)
    data.derivedStats.accuracy.baseValue = Math.ceil(
      (data.attribute.mind.baseValue +
        data.attribute.mind.staticMod +
        data.skill.rangedWeapons.training.baseValue +
        data.skill.rangedWeapons.training.staticMod) /
        2
    );
    data.derivedStats.accuracy.value =
      data.derivedStats.accuracy.baseValue +
      data.derivedStats.accuracy.staticMod;

    // Melee = (Body + Training in Melee Weapons) / 2 rounded up (+ Mod)
    data.derivedStats.melee.baseValue = Math.ceil(
      (data.attribute.body.baseValue +
        data.attribute.body.staticMod +
        data.skill.meleeWeapons.training.baseValue +
        data.skill.meleeWeapons.training.staticMod) /
        2
    );
    data.derivedStats.melee.value =
      data.derivedStats.melee.baseValue + data.derivedStats.melee.staticMod;

    // Reflexes = (Mind + (Body/2))
    data.resistance.reflexes.baseValue =
      data.attribute.mind.value + Math.ceil(data.attribute.body.value / 2);
    data.resistance.reflexes.value =
      data.resistance.reflexes.baseValue + data.resistance.reflexes.staticMod;

    // Resilience = (Body + (Soul/2))
    data.resistance.resilience.baseValue =
      data.attribute.body.value + Math.ceil(data.attribute.soul.value / 2);
    data.resistance.resilience.value =
      data.resistance.resilience.baseValue +
      data.resistance.resilience.staticMod;

    // Willpower = (Soul + (Mind/2))
    data.resistance.willpower.baseValue =
      data.attribute.soul.value + Math.ceil(data.attribute.mind.value / 2);
    data.resistance.willpower.value =
      data.resistance.willpower.baseValue + data.resistance.willpower.staticMod;

    // Calculate max stamina
    let maxStaminaBase =
      totalBaseAttributeValue *
      CONFIG.TITAN.settings.resources.stamina.maxBaseMulti;
    data.resources.stamina.maxBase = maxStaminaBase;
    data.resources.stamina.maxValue =
      maxStaminaBase + data.resources.stamina.staticMod;

    // Calculate max resolve
    let maxResolveBase = Math.ceil(
      (data.attribute.soul.baseValue *
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
    for (let [k, v] of Object.entries(data.skill)) {
      data.skill[k].training.value =
        v.training.baseValue + v.training.staticMod;
      data.skill[k].expertise.value =
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

    // Add cost of current attribute
    for (const attribute in data.attribute) {
      const attributeBaseValue = data.attribute[attribute].baseValue;

      // Calculate xp cost
      const minAttributeValue = CONFIG.TITAN.settings.attribute.min;
      if (attributeBaseValue > minAttributeValue) {
        spentExp =
          spentExp +
          CONFIG.TITAN.settings.attribute.totalExpCostByRank[
            attributeBaseValue - minAttributeValue - 1
          ];
      }
    }

    // Add cost of current skill
    for (const skill in data.skill) {
      const skillData = data.skill[skill];

      // Calculate xp cost of training
      const skillTrainingBaseValue = skillData.training.baseValue;
      if (skillTrainingBaseValue > 0) {
        spentExp =
          spentExp +
          CONFIG.TITAN.settings.skill.training.totalExpCostByRank[
            skillTrainingBaseValue - 1
          ];
      }

      // Calculate xp cost of training
      const skillExpertiseBaseValue = skillData.expertise.baseValue;
      if (skillExpertiseBaseValue > 0) {
        spentExp =
          spentExp +
          CONFIG.TITAN.settings.skill.expertise.totalExpCostByRank[
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

  async getInitiativeRoll(inData) {
    // Calculate the initiative value
    const initiative = this.data.data.derivedStats.initiative.value;

    // Get the initiative formula
    let initiativeFormula = "";
    const initiativeSettings = game.settings.get("titan", "initiativeFormula");
    if (initiativeSettings == "roll2d6") {
      initiativeFormula = "2d6+";
    } else if (initiativeSettings == "roll1d6") {
      initiativeFormula = "1d6+";
    }

    const roll = new Roll(
      initiativeFormula +
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
      difficulty:
        inData?.difficulty > 1 && inData?.difficulty < 7
          ? inData.difficulty
          : 4,
      complexity: inData?.complexity > -1 ? inData.complexity : 0,
      diceMod: inData?.diceMod ? inData.diceMod : 0,
      expertiseMod: inData?.expertiseMod > 0 ? inData.expertiseMod : 0,
      getOptions: inData?.getOptions ? inData.getOptions : false,
    };

    // Check if the attribute is the default attribute
    if (checkOptions.attribute == "default") {
      // Ensure the attribute is set
      checkOptions.attribute =
        this.data.data.skill[checkOptions.skill].defaultAttribute;
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
        attributeOptions: {},
        skillOptions: {},
      };

      // Add each attribute as an option to the data
      for (let [k, v] of Object.entries(this.data.data.attribute)) {
        dialogData.attributeOptions[k] =
          "TITAN.attribute.option." + k.toString() + ".label";
      }

      // Add each skill as an option to the data
      for (let [k, v] of Object.entries(this.data.data.skill)) {
        dialogData.skillOptions[k] =
          "TITAN.skill.option." + k.toString() + ".label";
      }

      // Create the html template
      const html = await renderTemplate(
        "systems/titan/templates/checks/check-basic-dialog.hbs",
        dialogData
      );

      // Create the dialog
      checkOptions = await new Promise((resolve) => {
        const data = {
          title: game.i18n.localize(CONFIG.TITAN.local.check.name),
          content: html,
          buttons: {
            roll: {
              label: game.i18n.localize(CONFIG.TITAN.local.check.roll),
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

      // Return if we cancelled the check
      if (checkOptions.cancelled) {
        return checkOptions;
      }

      // Validate difficulty
      if (checkOptions.difficulty > 6) {
        checkOptions.difficulty = 6;
      } else if (checkOptions.difficulty < 2) {
        checkOptions.difficulty = 2;
      }

      // Validate complexity
      if (checkOptions.complexity < 0) {
        checkOptions.complexity = 0;
      }
    }

    // Create the check parameters
    let checkParameters = {
      numberOfDice:
        this.data.data.attribute[checkOptions.attribute].value +
        checkOptions.diceMod,
      expertise: checkOptions.expertiseMod,
      difficulty: checkOptions.difficulty,
      complexity: checkOptions.complexity,
    };

    // Calculate the skill mod
    if (checkOptions.skill != "none") {
      const skillData = this.data.data.skill[checkOptions.skill];

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
      complexity: parseInt(form.complexity.value),
      diceMod: parseInt(form.diceMod.value),
      expertiseMod: 0,
    };
  }

  async getResistanceCheck(inData) {
    // Get a check from the actor
    let checkOptions = {
      resistance: inData?.resistance ? inData.resistance : "reflexes",
      difficulty:
        inData?.difficulty > 1 && inData?.difficulty < 7
          ? inData.difficulty
          : 4,
      complexity: inData?.complexity > -1 ? inData.complexity : 0,
      diceMod: inData?.diceMod ? inData.diceMod : 0,
      expertiseMod: inData?.expertiseMod > 0 ? inData.expertiseMod : 0,
      getOptions: inData?.getOptions ? inData.getOptions : false,
    };

    // Get options?
    if (checkOptions.getOptions) {
      // Initialize dialog data
      let dialogData = {
        resistance: checkOptions.resistance,
        difficulty: checkOptions.difficulty,
        complexity: checkOptions.complexity,
        diceMod: checkOptions.diceMod,
        expertiseMod: checkOptions.expertiseMod,
        resistanceOptions: {},
      };

      // Add each resistance as an option to the data
      for (let [k, v] of Object.entries(this.data.data.resistance)) {
        dialogData.resistanceOptions[k] =
          "TITAN.resistance.option." + k.toString() + ".label";
      }

      // Create the html template
      const html = await renderTemplate(
        "systems/titan/templates/checks/check-resistance-dialog.hbs",
        dialogData
      );

      // Create the dialog
      checkOptions = await new Promise((resolve) => {
        const data = {
          title: game.i18n.localize(CONFIG.TITAN.local.check.name),
          content: html,
          buttons: {
            roll: {
              label: game.i18n.localize(CONFIG.TITAN.local.roll),
              callback: (html) =>
                resolve(
                  this._processResistanceCheckOptions(
                    html[0].querySelector("form")
                  )
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

      // Return if we cancelled the check
      if (checkOptions.cancelled) {
        return checkOptions;
      }

      // Validate difficulty
      if (checkOptions.difficulty > 6) {
        checkOptions.difficulty = 6;
      } else if (checkOptions.difficulty < 2) {
        checkOptions.difficulty = 2;
      }

      // Validate complexity
      if (checkOptions.complexity < 0) {
        checkOptions.complexity = 0;
      }
    }

    // Create the check parameters
    let checkParameters = {
      numberOfDice:
        this.data.data.resistance[checkOptions.resistance].value +
        checkOptions.diceMod,
      expertise: checkOptions.expertiseMod,
      difficulty: checkOptions.difficulty,
      complexity: checkOptions.complexity,
    };

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
  _processResistanceCheckOptions(form) {
    return {
      resistance: form.resistance.value,
      difficulty: parseInt(form.difficulty.value),
      complexity: parseInt(form.complexity.value),
      diceMod: parseInt(form.diceMod.value),
      expertiseMod: 0,
    };
  }
}
