import TitanCheck from "./check.mjs";

export default class TitanAttributeCheck extends TitanCheck {
  // Constructor
  constructor(inData) {
    super(inData);

    // Ensure this check is valid
    if (!this.isValid) {
      return this;
    }

    /// Initialize attribute parameters
    this.parameters.attribute = inData.attribute ?? "body";

    return this;
  }

  _calculateActorData(checkData) {
    const actorData = super._calculateActorData(checkData);

    // Get the skill training and expertise values
    return {
      attributeDice: checkData.attribute[this.parameters.attribute].value,
    };
  }

  _calculateFinalData(actorData) {
    // Calculate the final total dice and expertise
    const finalData = super._calculateFinalData(actorData);

    // Calculate the total training dice
    // Add the training dice to the total dice
    finalData.totalDice = this.parameters.diceMod + actorData.attributeDice;

    // Calculcate the total expertise
    const totalExpertise = this.parameters.expertiseMod;
    if (this.parameters.doubleExpertise) {
      totalExpertise *= 2;
    }
    finalData.totalExpertise = totalExpertise;

    return finalData;
  }
}
