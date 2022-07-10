import TitanCheck from "./check.mjs";

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
    finalData.totalDice =
      this.parameters.diceMod +
      actorData.attributeDice +
      actorData.resistanceDice;

    return finalData;
  }
}
