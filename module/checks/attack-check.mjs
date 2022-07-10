import TitanCheck from "./check.mjs";

export default class TitanAttackCheck extends TitanCheck {
  constructor(inData) {
    // Check if the ID is valid
    if (!inData?.actorId) {
      console.error(
        "TITAN | Check failed during construction. No provided Actor ID."
      );
      this.isValid = false;
      return this;
    }

    // Check if the actor is valid
    const checkActor = game.actors.get(inData.actorId);
    if (!checkActor) {
      console.error(
        "TITAN | Check failed during construction. Invalid Actor ID."
      );
      this.isValid = false;
      return this;
    }

    // Get the weapon
    const checkWeapon = this.items.get(inData.weaponId);
    if (!weapon) {
      console.log(
        "TITAN | Check failed during construction. Invalid Weapon ID." + inData
      );
      this.isValid = false;
      return this;
    }

    // Get the attack
    const checkAttack = checkWeapon.system.attack[inData.attackIdx];
    if (!checkAttack) {
      console.log(
        "TITAN | Check failed during construction. Invalid Attack IDX." + inData
      );
      this.isValid = false;
      return this;
    }

    // Initialize state variables
    this.isValid = true;
    this.isPrepared = false;
    this.isEvaluated = false;

    // Initialize parameters
    this.parameters = {
      actorId: inData.actorId,
      targetId: inData.targetId ?? false,
      weaponId: inData.weaponId,
      attackIdx: inData.attackIdx,
      attribute: inData.attribute ?? false,
      skill: inData.skill ?? false,
      targetDefense: inData.targetDefense ?? false,
      attackerMelee: inData.attackerMelee ?? false,
      attackerAccuracy: inData.attackerAccuracy ?? false,
      difficulty: inData.difficulty ?? false,
      complexity: 1,
      diceMod: inData.diceMod ?? 0,
      trainingMod: inData.trainingMod ?? 0,
      expertiseMod: inData.expertiseMod ?? 0,
      doubleExpertise: inData.doubleExpertise ?? false,
      maximizeSuccesses: inData.maximizeSuccesses ?? false,
      extraSuccessOnCritical: inData.extraSuccessOnCritical ?? false,
      extraFailureOnCritical: inData.extraFailureOnCritical ?? false,
    };

    return this;
  }

  _calculateCheckData(actorCheckData) {
    // Get the weapon reference
    const checkWeapon = game.items.get(this.parameters.weaponId);
    if (!checkWeapon) {
      console.error(
        "TITAN | Attack Check failed during calculatCheckData(). Invalid Weapon ID."
      );
      this.isValid = false;
      return;
    }

    // Get the attack reference
    const checkAttack = checkWeapon.system.attack[this.parameters.attackIdx];
    if (!checkAttack) {
      console.error(
        "TITAN | Attack Check failed during calculateCheckData(). Invalid Weapon ID."
      );
      this.isValid = false;
      return;
    }

    // Get the actor data
    const checkData = super._calculateCheckData(actorCheckData);

    // Cache the attack info
    this.checkData.attack = checkAttack;
    this.checkData.weaponName = checkWeapon.name;

    // Get the attribute value
    checkData.checkAttribute = this.parameters.attribute
      ? this.parameters.attribute
      : checkAttack.attribute;
    checkData.attributeDice =
      actorCheckData.attribute[checkData.checkAttribute].value;

    // Get the skill training and expertise values
    checkData.checkSkill = this.parameters.skill
      ? this.parameters.attribute
      : checkAttack.skill;
    const skill = actorCheckData.skill[checkAttack.skill];
    checkData.skillTrainingDice = skill.training.value;
    checkData.skillExpertise = skill.expertise.value;

    // Calculate the difficulty
    if (!inData.difficulty) {
    }

    return checkData;
  }

  _calculateFinalData(checkData) {
    // Calculate the final total dice and expertise
    const finalData = super._calculateFinalData(checkData);

    // Calculate the total training dice
    const totalTrainingDice =
      checkData.skillTrainingDice + this.parameters.trainingMod;
    if (this.parameters.doubleTraining) {
      totalTrainingDice *= 2;
    }

    // Add the training dice to the total dice
    finalData.totalDice =
      this.parameters.diceMod + checkData.attributeDice + totalTrainingDice;

    // Calculcate the total expertise
    const totalExpertise =
      checkData.skillExpertise + this.parameters.expertiseMod;
    if (this.parameters.doubleExpertise) {
      totalExpertise *= 2;
    }
    finalData.totalExpertise = totalExpertise;

    return finalData;
  }

  // Creates a dialog for getting options for this skill check
  static async getOptionsFromDialog(initialOptions) {
    // Initialize dialog data
    const dialogData = {
      attribute: initialOptions?.attribute ?? "body",
      skill: initialOptions?.skill ?? "athletics",
      difficulty: initialOptions?.difficulty
        ? TitanUtility.clamp(initialOptions.difficulty, 2, 6)
        : 4,
      complexity: initialOptions?.complexity
        ? Math.max(checkOptions.complexity, 0)
        : 0,
      diceMod: initialOptions?.diceMod ?? 0,
      trainingMod: initialOptions?.trainingMod ?? 0,
      expertiseMod: initialOptions?.expertiseMod ?? 0,
      doubleExpertise: initialOptions?.doubleExpertise ?? false,
      maximizeSuccesses: initialOptions?.maximizeSuccesses ?? false,
      extraSuccessOnCritical: initialOptions?.extraSuccessOnCritical ?? false,
      extraFailureOnCritical: initialOptions?.extraFailureOnCritical ?? false,
      attributeOptions: {},
      skillOptions: {},
    };

    // Add each attribute as an option to the data
    for (let [k, v] of Object.entries(CONFIG.TITAN.attribute.option)) {
      dialogData.attributeOptions[k] = game.i18n.localize(v.label);
    }
    // Add default as an attribute option
    dialogData.skillOptions.default = game.i18n.localize(
      CONFIG.TITAN.default.label
    );

    // Add each skill as an option to the data
    for (let [k, v] of Object.entries(CONFIG.TITAN.skill.option)) {
      dialogData.skillOptions[k] = game.i18n.localize(v.label);
    }
    // Add default as a skill option
    dialogData.skillOptions.default = game.i18n.localize(
      CONFIG.TITAN.default.label
    );

    // Create the html template
    const html = await renderTemplate(
      "systems/titan/templates/checks/attack-check-dialog.hbs",
      dialogData
    );

    // Proccesses the results of a skill check dialog
    function _processSkillCheckOptions(form) {
      return {
        attribute: form.attribute.value,
        skill: form.skill.value,
        difficulty: parseInt(form.difficulty.value),
        complexity: parseInt(form.complexity.value),
        diceMod: parseInt(form.diceMod.value),
        expertiseMod: parseInt(form.expertiseMod.value),
      };
    }

    // Create the dialog
    const checkOptions = await new Promise((resolve) => {
      const data = {
        title: game.i18n.localize(CONFIG.TITAN.check.label),
        content: html,
        buttons: {
          roll: {
            label: game.i18n.localize(CONFIG.TITAN.roll.label),
            callback: (html) =>
              resolve(_processSkillCheckOptions(html[0].querySelector("form"))),
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

    // Validate the results if appropriate
    if (!checkOptions.cancelled) {
      // Validate difficulty
      checkOptions.difficulty = TitanUtility.clamp(
        checkOptions.difficulty,
        2,
        6
      );

      // Validate complexity
      checkOptions.complexity = Math.max(checkOptions.complexity, 0);
    }

    return checkOptions;
  }

  _getChatTemplate() {
    return "systems/titan/templates/checks/attack-check-chat-message.hbs";
  }
}
