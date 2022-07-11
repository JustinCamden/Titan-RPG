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
    systemData.rating.initiative.baseValue =
      systemData.attribute.mind.baseValue +
      systemData.attribute.mind.staticMod +
      systemData.skill.dexterity.training.baseValue +
      systemData.skill.dexterity.training.staticMod +
      systemData.skill.perception.training.baseValue +
      systemData.skill.perception.training.staticMod;
    systemData.rating.initiative.value =
      systemData.rating.initiative.baseValue +
      systemData.rating.initiative.staticMod;

    // Awareness = (Mind + Training in Awareness) / 2 rounded up (+ Mod)
    systemData.rating.awareness.baseValue = Math.ceil(
      (systemData.attribute.mind.baseValue +
        systemData.attribute.mind.staticMod +
        systemData.skill.perception.training.baseValue +
        systemData.skill.perception.training.staticMod) /
        2
    );
    systemData.rating.awareness.value =
      systemData.rating.awareness.baseValue +
      systemData.rating.awareness.staticMod;

    // Defense = (Body + Training in Dexterity) / 2 rounded up (+ Mod)
    systemData.rating.defense.baseValue = Math.ceil(
      (systemData.attribute.body.baseValue +
        systemData.attribute.body.staticMod +
        systemData.skill.dexterity.training.baseValue +
        systemData.skill.dexterity.training.staticMod) /
        2
    );
    systemData.rating.defense.value =
      systemData.rating.defense.baseValue + systemData.rating.defense.staticMod;

    // Accuracy = (Mind + Training in Ranged Weapons) / 2 rounded up (+ Mod)
    systemData.rating.accuracy.baseValue = Math.ceil(
      (systemData.attribute.mind.baseValue +
        systemData.attribute.mind.staticMod +
        systemData.skill.rangedWeapons.training.baseValue +
        systemData.skill.rangedWeapons.training.staticMod) /
        2
    );
    systemData.rating.accuracy.value =
      systemData.rating.accuracy.baseValue +
      systemData.rating.accuracy.staticMod;

    // Melee = (Body + Training in Melee Weapons) / 2 rounded up (+ Mod)
    systemData.rating.melee.baseValue = Math.ceil(
      (systemData.attribute.body.baseValue +
        systemData.attribute.body.staticMod +
        systemData.skill.meleeWeapons.training.baseValue +
        systemData.skill.meleeWeapons.training.staticMod) /
        2
    );
    systemData.rating.melee.value =
      systemData.rating.melee.baseValue + systemData.rating.melee.staticMod;

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
    const initiative = this.system.rating.initiative.value;

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
    let checkOptions = inData;

    // Check if the attribute set to default
    if (checkOptions.attribute == "default") {
      // If so, ensure the attribute is set
      checkOptions.attribute =
        this.system.skill[checkOptions.skill].defaultAttribute;
    }

    // Get the options from a dialog if appropriate
    if (inData?.getOptions) {
      checkOptions = await TitanSkillCheck.getOptionsFromDialog(checkOptions);

      // Return if cancelled
      if (checkOptions.cancelled) {
        return;
      }
    }

    // Get the actor check data
    const actorCheckData = this.getCheckData();
    checkOptions.actorCheckData = actorCheckData;

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

  async getResistanceCheck(inData) {
    // Get a check from the actor
    let checkOptions = inData;

    // Get options?
    if (inData?.getOptions) {
      checkOptions = await TitanResistanceCheck.getOptionsFromDialog(
        checkOptions
      );

      // Return if cancelled
      if (checkOptions.cancelled) {
        return;
      }
    }

    // Get the actor check data
    const actorCheckData = this.getCheckData();
    checkOptions.actorCheckData = actorCheckData;

    // Perform the roll
    const resistanceCheck = new TitanResistanceCheck(checkOptions);

    // Return the data
    return resistanceCheck;
  }

  async getAttackCheck(inData) {
    // Get the weapon check data.
    const checkWeapon = this.items.get(inData?.weaponId);
    if (!checkWeapon) {
      console.error(
        "TITAN | Attack check failed. Invalid weapon ID provided to actor"
      );

      return false;
    }

    // Initialize check options
    let checkOptions = inData;

    // Get the options from a dialog if appropriate
    if (inData.getOptions) {
      checkOptions = await TitanAttackCheck.getOptionsFromDialog(checkOptions);

      // Return if cancelled
      if (checkOptions.cancelled) {
        return;
      }
    }

    // Add the actor check data to the check options
    const actorCheckData = this.getCheckData();
    checkOptions.actorCheckData = actorCheckData;

    // Add the weapon data to the check options
    const weaponCheckData = checkWeapon.getCheckData();
    checkOptions.weaponCheckData = weaponCheckData;
    checkOptions.weaponName = checkWeapon.name;

    // Get the target check data
    const userTargets = Array.from(game.user.targets);
    if (userTargets[0]) {
      const targetCheckData = userTargets[0].document.actor.getCheckData();
      checkOptions.targetCheckData = targetCheckData;
    }

    // Perform the attack
    const attackCheck = new TitanAttackCheck(checkOptions);
    return attackCheck;
  }

  getCheckData() {
    const checkData = this.system;
    return checkData;
  }
}
