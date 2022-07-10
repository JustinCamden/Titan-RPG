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

  _calculateCheckData(actorCheckData) {
    const checkData = super._calculateCheckData(actorCheckData);
    checkData.attributeDice =
      actorCheckData.attribute[this.parameters.attribute].value;

    // Get the skill training and expertise values
    return checkData;
  }

  _calculateFinalData(checkData) {
    // Calculate the final total dice and expertise
    const finalData = super._calculateFinalData(checkData);

    // Calculate the total training dice
    // Add the training dice to the total dice
    finalData.totalDice = this.parameters.diceMod + checkData.attributeDice;

    // Calculcate the total expertise
    const totalExpertise = this.parameters.expertiseMod;
    if (this.parameters.doubleExpertise) {
      totalExpertise *= 2;
    }
    finalData.totalExpertise = totalExpertise;

    return finalData;
  }
}
