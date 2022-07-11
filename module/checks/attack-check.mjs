import TitanUtility from "../helpers/utility.mjs";
import TitanSkillCheck from "./skill-check.mjs";

export default class TitanAttackCheck extends TitanSkillCheck {
  _ensureValidConstruction(inData) {
    if (!super._ensureValidConstruction(inData)) {
      return false;
    }

    // Check if the weapon is valid
    const weaponCheckData = inData.weaponCheckData;
    if (!weaponCheckData) {
      console.log(
        "TITAN | Attack Check failed during construction. Invalid Data." +
          inData
      );
      return false;
    }

    // Check if the attack is valid
    const checkAttack = weaponCheckData.attack[inData.attackIdx];
    if (!checkAttack) {
      console.log(
        "TITAN | Attack Check failed during construction. Attack IDX." + inData
      );
      return false;
    }

    return true;
  }

  _initializeParameters(inData) {
    const parameters = {
      attribute: inData.attribute ?? false,
      skill: inData.skill ?? false,
      type: inData.type ?? false,
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
      weaponName:
        inData.weaponName ??
        game.i18n.localize(CONFIG.TITAN.weapon.unarmed.label),
    };

    return parameters;
  }

  _calculateDerivedData(inData) {
    // Get the weapon reference
    const actorCheckData = inData.actorCheckData;
    const weaponCheckData = inData.weaponCheckData;
    const targetCheckData = inData.targetCheckData;
    const checkAttack = weaponCheckData.attack[inData.attackIdx];

    // Get the skill
    if (!this.parameters.skill) {
      this.parameters.skill = checkAttack.skill;
    }

    // Get the attribute
    if (!this.parameters.attribute) {
      this.parameters.attribute = checkAttack.attribute;
    }

    // Get the actor data
    super._calculateDerivedData(inData);

    // Cache the attack info
    this.parameters.attack = checkAttack;

    // Get the skill training and expertise value
    const skill = actorCheckData.skill[this.parameters.skill];
    this.parameters.skillTrainingDice = skill.training.value;
    this.parameters.skillExpertise = skill.expertise.value;

    // Get the attack type
    if (!this.parameters.type) {
      this.parameters.type = checkAttack.type;
    }

    // Calculate ratings
    if (!this.parameters.attackerMelee) {
      this.parameters.attackerMelee = actorCheckData.rating.melee.value;
    }
    if (!this.parameters.attackerAccuracy) {
      this.parameters.attackerAccuracy = actorCheckData.rating.accuracy.value;
    }
    if (!this.parameters.targetDefense && targetCheckData) {
      this.parameters.targetDefense = targetCheckData.rating.defense.value;
    }

    // Calculate the difficulty if difficulty was not provided
    if (!this.parameters.difficulty) {
      // If the target is valid
      if (this.parameters.targetDefense != false) {
        // Calculate the attacker rating
        const attackerRating =
          this.parameters.type == "melee"
            ? this.parameters.attackerMelee
            : this.parameters.attackerAccuracy;

        // Difficulty = 4 + defense rating - attacker rating
        this.parameters.difficulty = TitanUtility.clamp(
          this.parameters.targetDefense - attackerRating + 4,
          2,
          6
        );
      } else {
        this.parameters.difficulty = 4;
      }
    }

    return;
  }

  _calculateTotalDiceAndExpertise(checkData) {
    // Calculate the final total dice and expertise
    super._calculateTotalDiceAndExpertise(checkData);

    // Calculate the total training dice
    const totalTrainingDice =
      this.parameters.skillTrainingDice + this.parameters.trainingMod;
    if (this.parameters.doubleTraining) {
      totalTrainingDice *= 2;
    }

    // Add the training dice to the total dice
    this.parameters.totalDice =
      this.parameters.diceMod +
      this.parameters.attributeDice +
      totalTrainingDice;

    // Calculcate the total expertise
    const totalExpertise =
      this.parameters.skillExpertise + this.parameters.expertiseMod;
    if (this.parameters.doubleExpertise) {
      totalExpertise *= 2;
    }
    this.parameters.totalExpertise = totalExpertise;

    return;
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
