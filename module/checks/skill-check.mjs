import TitanUtility from "../helpers/utility.mjs";
import TitanAttributeCheck from "./attribute-check.mjs";

export default class TitanSkillCheck extends TitanAttributeCheck {
  // Constructor
  constructor(inData) {
    super(inData);

    // Ensure this check is valid
    if (!this.isValid) {
      return this;
    }

    /// Initialize skill parameters
    this.parameters.skill = inData.skill ?? "athletics";
    this.parameters.trainingMod = inData.trainingMod ?? false;
    this.parameters.doubleTraining = inData.doubleTraining ?? false;

    return this;
  }

  _calculateCheckData(actorCheckData) {
    const checkData = super._calculateCheckData(actorCheckData);

    // Get the skill training and expertise values
    const skill = actorCheckData.skill[this.parameters.skill];
    checkData.skillTrainingDice = skill.training.value;
    checkData.skillExpertise = skill.expertise.value;

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

    // Add each skill as an option to the data
    for (let [k, v] of Object.entries(CONFIG.TITAN.skill.option)) {
      dialogData.skillOptions[k] = game.i18n.localize(v.label);
    }
    // Add none as a skill option
    dialogData.skillOptions.none = game.i18n.localize(CONFIG.TITAN.none.label);

    // Create the html template
    const html = await renderTemplate(
      "systems/titan/templates/checks/skill-check-dialog.hbs",
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
}
