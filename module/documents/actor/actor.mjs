/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */

import { TitanCheck } from "../../helpers/check.mjs";
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
    // Make separate methods for each Actor type (player, npc, etc.) to keep
    // things organized.
    switch (this.type) {
      case "player": {
        this._preparePlayerData();
        break;
      }
      case "npc": {
        this._prepareNpcData();
        break;
      }
      default: {
        console.error("TITAN: Invalid actor type when preparing derived data.");
        break;
      }
    }
  }

  // Prepare Character type specific data
  _prepareCharacterData() {
    // Make modifications to data here. For example:
    const systemData = this.system;

    // Calculate ability mods
    for (let [k, v] of Object.entries(systemData.attribute)) {
      systemData.attribute[k].value = v.baseValue + v.staticMod;
    }

    // Calculate the total attribute value
    let totalBaseAttributeValue = 0;
    for (const attribute in systemData.attribute) {
      totalBaseAttributeValue =
        totalBaseAttributeValue + systemData.attribute[attribute].baseValue;
    }

    // Calculate derived stats
    // Initiative = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    systemData.derivedStats.initiative.baseValue =
      systemData.attribute.mind.baseValue +
      systemData.attribute.mind.staticMod +
      systemData.skill.dexterity.training.baseValue +
      systemData.skill.dexterity.training.staticMod +
      systemData.skill.perception.training.baseValue +
      systemData.skill.perception.training.staticMod;
    systemData.derivedStats.initiative.value =
      systemData.derivedStats.initiative.baseValue +
      systemData.derivedStats.initiative.staticMod;

    // Awareness = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    systemData.derivedStats.awareness.baseValue = Math.ceil(
      (systemData.attribute.mind.baseValue +
        systemData.attribute.mind.staticMod +
        systemData.skill.perception.training.baseValue +
        systemData.skill.perception.training.staticMod) /
        2
    );
    systemData.derivedStats.awareness.value =
      systemData.derivedStats.awareness.baseValue +
      systemData.derivedStats.awareness.staticMod;

    // Defense = (Body + Training in Dexterity) / 2 rounded up (+ Mod)
    systemData.derivedStats.defense.baseValue = Math.ceil(
      (systemData.attribute.body.baseValue +
        systemData.attribute.body.staticMod +
        systemData.skill.dexterity.training.baseValue +
        systemData.skill.dexterity.training.staticMod) /
        2
    );
    systemData.derivedStats.defense.value =
      systemData.derivedStats.defense.baseValue +
      systemData.derivedStats.defense.staticMod;

    // Accuracy = (Mind + Training in Ranged Weapons) / 2 rounded up (+ Mod)
    systemData.derivedStats.accuracy.baseValue = Math.ceil(
      (systemData.attribute.mind.baseValue +
        systemData.attribute.mind.staticMod +
        systemData.skill.rangedWeapons.training.baseValue +
        systemData.skill.rangedWeapons.training.staticMod) /
        2
    );
    systemData.derivedStats.accuracy.value =
      systemData.derivedStats.accuracy.baseValue +
      systemData.derivedStats.accuracy.staticMod;

    // Melee = (Body + Training in Melee Weapons) / 2 rounded up (+ Mod)
    systemData.derivedStats.melee.baseValue = Math.ceil(
      (systemData.attribute.body.baseValue +
        systemData.attribute.body.staticMod +
        systemData.skill.meleeWeapons.training.baseValue +
        systemData.skill.meleeWeapons.training.staticMod) /
        2
    );
    systemData.derivedStats.melee.value =
      systemData.derivedStats.melee.baseValue +
      systemData.derivedStats.melee.staticMod;

    // Reflexes = (Mind + (Body/2))
    systemData.resistance.reflexes.baseValue =
      systemData.attribute.mind.value +
      Math.ceil(systemData.attribute.body.value / 2);
    systemData.resistance.reflexes.value =
      systemData.resistance.reflexes.baseValue +
      systemData.resistance.reflexes.staticMod;

    // Resilience = (Body + (Soul/2))
    systemData.resistance.resilience.baseValue =
      systemData.attribute.body.value +
      Math.ceil(systemData.attribute.soul.value / 2);
    systemData.resistance.resilience.value =
      systemData.resistance.resilience.baseValue +
      systemData.resistance.resilience.staticMod;

    // Willpower = (Soul + (Mind/2))
    systemData.resistance.willpower.baseValue =
      systemData.attribute.soul.value +
      Math.ceil(systemData.attribute.mind.value / 2);
    systemData.resistance.willpower.value =
      systemData.resistance.willpower.baseValue +
      systemData.resistance.willpower.staticMod;

    // Calculate max stamina
    let maxStaminaBase =
      totalBaseAttributeValue *
      CONFIG.TITAN.resource.option.stamina.maxBaseMulti;
    systemData.resources.stamina.maxBase = maxStaminaBase;
    systemData.resources.stamina.maxValue =
      maxStaminaBase + systemData.resources.stamina.staticMod;

    // Calculate max resolve
    let maxResolveBase = Math.ceil(
      (systemData.attribute.soul.baseValue *
        CONFIG.TITAN.resource.option.resolve.maxBaseMulti) /
        2
    );
    systemData.resources.resolve.maxBase = maxResolveBase;
    systemData.resources.resolve.maxValue =
      maxResolveBase + systemData.resources.resolve.staticMod;

    // Calculate max wounds
    let maxWoundsBase = Math.ceil(
      (totalBaseAttributeValue *
        CONFIG.TITAN.resource.option.wounds.maxBaseMulti) /
        2
    );
    systemData.resources.wounds.maxBase = maxWoundsBase;
    systemData.resources.wounds.maxValue =
      maxWoundsBase + systemData.resources.wounds.staticMod;

    // Calculate skill mods
    for (let [k, v] of Object.entries(systemData.skill)) {
      systemData.skill[k].training.value =
        v.training.baseValue + v.training.staticMod;
      systemData.skill[k].expertise.value =
        v.expertise.baseValue + v.expertise.staticMod;
    }
  }

  /**
   * Prepare Player type specific data
   */
  _preparePlayerData() {
    // Prepare template data
    this._prepareCharacterData();

    // Make modifications to data here.
    const systemData = this.system;

    // Calculate the amount of EXP spent
    let spentExp = 0;

    // Add cost of current attribute
    for (const attribute in systemData.attribute) {
      const attributeBaseValue = systemData.attribute[attribute].baseValue;

      // Calculate xp cost
      const minAttributeValue = CONFIG.TITAN.attribute.min;
      if (attributeBaseValue > minAttributeValue) {
        spentExp =
          spentExp +
          CONFIG.TITAN.attribute.totalExpCostByRank[
            attributeBaseValue - minAttributeValue - 1
          ];
      }
    }

    // Add cost of current skill
    for (const skill in systemData.skill) {
      const skillData = systemData.skill[skill];

      // Calculate xp cost of training
      const skillTrainingBaseValue = skillData.training.baseValue;
      if (skillTrainingBaseValue > 0) {
        spentExp =
          spentExp +
          CONFIG.TITAN.skill.training.totalExpCostByRank[
            skillTrainingBaseValue - 1
          ];
      }

      // Calculate xp cost of training
      const skillExpertiseBaseValue = skillData.expertise.baseValue;
      if (skillExpertiseBaseValue > 0) {
        spentExp =
          spentExp +
          CONFIG.TITAN.skill.expertise.totalExpCostByRank[
            skillExpertiseBaseValue - 1
          ];
      }
    }

    systemData.exp.available = systemData.exp.earned - spentExp;
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    // Prepare template data
    this._prepareCharacterData();
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const rollData = super.getRollData();

    // Prepare player roll data.
    this._getPlayerRollData(rollData);
    this._getNpcRollData(rollData);

    return rollData;
  }

  /**
   * Prepare player roll data.
   */
  _getPlayerRollData(data) {
    if (this.type !== "player") return;

    // Copy the ability scores to the top level, so that rolls can use
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== "npc") return;

    // Process additional NPC data here.
  }

  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
  }

  async getInitiativeRoll(inData) {
    // Calculate the initiative value
    const initiative = this.system.derivedStats.initiative.value;

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
        this.system.skill[checkOptions.skill].defaultAttribute;
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
      for (let [k, v] of Object.entries(this.system.attribute)) {
        dialogData.attributeOptions[k] =
          "TITAN.attribute.option." + k.toString() + ".label";
      }

      // Add each skill as an option to the data
      for (let [k, v] of Object.entries(this.system.skill)) {
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
          title: game.i18n.localize(CONFIG.TITAN.check.label),
          content: html,
          buttons: {
            roll: {
              label: game.i18n.localize(CONFIG.TITAN.check.roll),
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
        this.system.attribute[checkOptions.attribute].value +
        checkOptions.diceMod,
      expertise: checkOptions.expertiseMod,
      difficulty: checkOptions.difficulty,
      complexity: checkOptions.complexity,
    };

    // Calculate the skill mod
    if (checkOptions.skill != "none") {
      const skillData = this.system.skill[checkOptions.skill];

      // Training
      checkParameters.numberOfDice =
        checkParameters.numberOfDice + skillData.training.value;

      // Expertise
      checkParameters.expertise =
        checkParameters.expertise + skillData.expertise.value;
    }

    // Perform the roll
    const check = new TitanCheck(checkParameters);

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
      expertiseMod: parseInt(form.expertiseMod.value),
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
      for (let [k, v] of Object.entries(this.system.resistance)) {
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
          title: game.i18n.localize(CONFIG.TITAN.check.label),
          content: html,
          buttons: {
            roll: {
              label: game.i18n.localize(CONFIG.TITAN.roll.label),
              callback: (html) =>
                resolve(
                  this._processResistanceCheckOptions(
                    html[0].querySelector("form")
                  )
                ),
            },
            cancel: {
              label: game.i18n.localize(CONFIG.TITAN.cancel.label),
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
        this.system.resistance[checkOptions.resistance].value +
        checkOptions.diceMod,
      expertise: checkOptions.expertiseMod,
      difficulty: checkOptions.difficulty,
      complexity: checkOptions.complexity,
    };

    // Perform the roll
    const check = new TitanCheck(checkParameters);

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
      expertiseMod: parseInt(form.expertiseMod.value),
    };
  }
}
