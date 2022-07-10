import TitanUtility from "../../helpers/utility.mjs";
import TitanCheck from "../../checks/check.mjs";
import TitanAttributeCheck from "../../checks/attribute-check.mjs";
import TitanSkillCheck from "../../checks/skill-check.mjs";
import TitanResistanceCheck from "../../checks/resistance-check.mjs";
import TitanAttackCheck from "../../checks/attack-check.mjs";

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
    systemData.initiative.baseValue =
      systemData.attribute.mind.baseValue +
      systemData.attribute.mind.staticMod +
      systemData.skill.dexterity.training.baseValue +
      systemData.skill.dexterity.training.staticMod +
      systemData.skill.perception.training.baseValue +
      systemData.skill.perception.training.staticMod;
    systemData.initiative.value =
      systemData.initiative.baseValue + systemData.initiative.staticMod;

    // Awareness = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    systemData.attackStats.awareness.baseValue = Math.ceil(
      (systemData.attribute.mind.baseValue +
        systemData.attribute.mind.staticMod +
        systemData.skill.perception.training.baseValue +
        systemData.skill.perception.training.staticMod) /
        2
    );
    systemData.attackStats.awareness.value =
      systemData.attackStats.awareness.baseValue +
      systemData.attackStats.awareness.staticMod;

    // Defense = (Body + Training in Dexterity) / 2 rounded up (+ Mod)
    systemData.attackStats.defense.baseValue = Math.ceil(
      (systemData.attribute.body.baseValue +
        systemData.attribute.body.staticMod +
        systemData.skill.dexterity.training.baseValue +
        systemData.skill.dexterity.training.staticMod) /
        2
    );
    systemData.attackStats.defense.value =
      systemData.attackStats.defense.baseValue +
      systemData.attackStats.defense.staticMod;

    // Accuracy = (Mind + Training in Ranged Weapons) / 2 rounded up (+ Mod)
    systemData.attackStats.accuracy.baseValue = Math.ceil(
      (systemData.attribute.mind.baseValue +
        systemData.attribute.mind.staticMod +
        systemData.skill.rangedWeapons.training.baseValue +
        systemData.skill.rangedWeapons.training.staticMod) /
        2
    );
    systemData.attackStats.accuracy.value =
      systemData.attackStats.accuracy.baseValue +
      systemData.attackStats.accuracy.staticMod;

    // Melee = (Body + Training in Melee Weapons) / 2 rounded up (+ Mod)
    systemData.attackStats.melee.baseValue = Math.ceil(
      (systemData.attribute.body.baseValue +
        systemData.attribute.body.staticMod +
        systemData.skill.meleeWeapons.training.baseValue +
        systemData.skill.meleeWeapons.training.staticMod) /
        2
    );
    systemData.attackStats.melee.value =
      systemData.attackStats.melee.baseValue +
      systemData.attackStats.melee.staticMod;

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
    const initiative = this.system.attackStats.initiative.value;

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

  // Get a check from the actor
  async getSkillCheck(inData) {
    // Initialize options
    let checkOptions = {
      attribute: inData?.attribute ?? "body",
      skill: inData?.skill ?? "athletics",
      difficulty: inData?.difficulty
        ? TitanUtility.clamp(inData.difficulty, 2, 6)
        : 4,
      complexity: inData?.complexity ? Math.max(inData.complexity, 0) : 0,
      diceMod: inData?.diceMod ?? 0,
      trainingMod: inData?.trainingMod ?? 0,
      expertiseMod: inData?.expertiseMod ?? 0,
      doubleExpertise: inData.doubleExpertise ?? false,
      maximizeSuccesses: inData.maximizeSuccesses ?? false,
      extraSuccessOnCritical: inData.extraSuccessOnCritical ?? false,
      extraFailureOnCritical: inData.extraFailureOnCritical ?? false,
    };

    // Check if the attribute set to default
    if (checkOptions.attribute == "default") {
      // If so, ensure the attribute is set
      checkOptions.attribute =
        this.system.skill[checkOptions.skill].defaultAttribute;
    }

    // If Get Options is true
    if (inData?.getOptions) {
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
      // Add none as a skill option
      dialogData.skillOptions.none = "TITAN.none.label";

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
              label: game.i18n.localize(CONFIG.TITAN.roll.label),
              callback: (html) =>
                resolve(
                  this._processSkillCheckOptions(html[0].querySelector("form"))
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
      checkOptions.difficulty = TitanUtility.clamp(
        checkOptions.difficulty,
        2,
        6
      );

      // Validate complexity
      checkOptions.complexity = Math.max(checkOptions.complexity, 0);
    }

    // Add this actor ID to the check options
    checkOptions.actorId = this.id;

    // Check if the skill is none
    if (checkOptions.skill == "none") {
      // If so, do an attribute check
      delete checkOptions.skill;
      delete checkOptions.trainingMod;
      const attributeCheck = new TitanAttributeCheck(checkOptions);
      return attributeCheck;
    }

    // Otherwise, do a skill check
    const skillCheck = new TitanSkillCheck(checkOptions);
    return skillCheck;
  }

  // Process check dialog results
  _processSkillCheckOptions(form) {
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
      difficulty: inData?.difficulty
        ? TitanUtility.clamp(inData.difficulty, 2, 6)
        : 4,
      complexity: inData?.complexity ? Math.max(inData.complexity, 0) : 0,
      diceMod: inData?.diceMod ?? 0,
      expertiseMod: inData?.expertiseMod ?? 0,
    };

    // Get options?
    if (inData?.getOptions) {
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
      checkOptions.difficulty = TitanUtility.clamp(
        checkOptions.difficulty,
        2,
        6
      );

      // Validate complexity
      checkOptions.complexity = Math.max(checkOptions.complexity, 0);
    }

    // Perform the roll
    checkOptions.actorId = this.id;
    const resistanceCheck = new TitanResistanceCheck(checkOptions);

    // Return the data
    return resistanceCheck;
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

  async getAttackCheck(inData) {
    // Get the weapon
    let checkOptions = {
      weapon: this.items.get(inData?.weaponId),
    };
    if (!checkOptions.weapon) {
      console.log("TITAN | Invalid Weapon " + inData);
      return { cancelled: true };
    }

    // Get the attack
    checkOptions.attack = checkOptions.weapon.system.attack[inData.attackIdx];
    if (!checkOptions.attack) {
      console.log("TITAN | Invalid Attack " + inData);
      return { cancelled: true };
    }

    // If the user has a valid target
    const userTargets = Array.from(game.user.targets);
    if (userTargets[0]) {
      // Cache the target
      checkOptions.target = game.actors.get(userTargets[0].document.actorId);

      // Calculate the difficulty to hit the target
      checkOptions.difficulty =
        4 +
        checkOptions.target.system.attackStats.defense.value -
        (checkOptions.attack.type == "melee"
          ? this.system.attackStats.melee.value
          : this.system.attackStats.accuracy.value);
      if (checkOptions.difficulty > 6) {
        checkOptions.difficulty = 6;
      } else if (checkOptions.difficulty < 2) {
        checkOptions.difficulty = 2;
      }
    } else {
      checkOptions.target = false;
      checkOptions.difficulty = 4;
    }

    // Calculate default check options
    checkOptions.complexity = 1;
    checkOptions.diceMod = 0;
    checkOptions.expertiseMod = 0;
    checkOptions.skill = checkOptions.attack.skill;
    checkOptions.attribute = checkOptions.attack.attribute;
    checkOptions.baseDamage = checkOptions.attack.damage;
    checkOptions.plusSuccessDamage = checkOptions.attack.plusSuccessDamage;

    // Create check parameters
    let checkParameters = {
      numberOfDice:
        this.system.attribute[checkOptions.attribute].value +
        this.system.skill[checkOptions.skill].training.value +
        checkOptions.diceMod,
      expertise:
        this.system.skill[checkOptions.skill].expertise.value +
        checkOptions.expertiseMod,
      difficulty: checkOptions.difficulty,
      complexity: checkOptions.complexity,
      baseDamage: checkOptions.baseDamage,
      plusSuccessDamage: checkOptions.plusSuccessDamage,
    };

    // Create the check
    const check = new TitanAttackCheck(checkParameters);

    // Return the data
    return {
      check: check,
      checkOptions: checkOptions,
      checkParameters: checkParameters,
    };
  }

  getCheckData() {
    const checkData = this.system;
    return checkData;
  }
}
