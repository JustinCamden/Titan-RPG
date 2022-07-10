import TitanCheck from "./check.mjs";
import TitanUtility from "../helpers/utility.mjs";

export default class TitanResistanceCheck extends TitanCheck {
  // Constructor
  constructor(inData) {
    super(inData);

    // Ensure this check is valid
    if (!this.isValid) {
      return this;
    }

    /// Initialize skill parameters
    this.parameters.resistance = inData.resistance ?? "reflexes";

    return this;
  }

  _calculateActorData(checkData) {
    const actorData = super._calculateActorData(checkData);

    // Get the resistance value
    actorData.resistanceDice =
      checkData.resistance[this.parameters.resistance].value;

    return actorData;
  }

  _calculateFinalData(actorData) {
    // Calculate the final total dice and expertise
    const finalData = super._calculateFinalData(actorData);

    // Add the training dice to the total dice
    finalData.totalDice = this.parameters.diceMod + actorData.resistanceDice;

    return finalData;
  }

  static async getOptionsFromDialog(initialOptions) {
    const dialogData = {
      resistance: initialOptions?.resistance ?? "reflexes",
      difficulty: initialOptions?.difficulty
        ? TitanUtility.clamp(initialOptions.difficulty, 2, 6)
        : 4,
      complexity: initialOptions?.complexity
        ? Math.max(checkOptions.complexity, 0)
        : 0,
      diceMod: initialOptions?.diceMod ?? 0,
      expertiseMod: initialOptions?.expertiseMod ?? 0,
      doubleExpertise: initialOptions?.doubleExpertise ?? false,
      maximizeSuccesses: initialOptions?.maximizeSuccesses ?? false,
      extraSuccessOnCritical: initialOptions?.extraSuccessOnCritical ?? false,
      extraFailureOnCritical: initialOptions?.extraFailureOnCritical ?? false,
      resistanceOptions: {},
    };

    // Add each resistance as an option to the data
    for (let [k, v] of Object.entries(CONFIG.TITAN.resistance.option)) {
      dialogData.resistanceOptions[k] = game.i18n.localize(v.label);
    }

    // Create the html template
    const html = await renderTemplate(
      "systems/titan/templates/checks/check-resistance-dialog.hbs",
      dialogData
    );

    // Process check dialog results
    function _processResistanceCheckOptions(form) {
      return {
        resistance: form.resistance.value,
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
              resolve(
                _processResistanceCheckOptions(html[0].querySelector("form"))
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
