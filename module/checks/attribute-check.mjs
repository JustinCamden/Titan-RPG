import TitanCheck from "./check.mjs";

export default class TitanAttributeCheck extends TitanCheck {
  _ensureValidConstruction(inData) {
    if (!super._ensureValidConstruction(inData)) {
      return false;
    }

    // Check if actor check data is valid
    if (!inData?.actorCheckData) {
      console.error(
        "TITAN | Attribute Check failed during construction. No provided Actor Check Data."
      );
      return false;
    }

    return true;
  }

  _initializeParameters(inData) {
    const parameters = super._initializeParameters(inData);

    // Initialize attribute parameters
    parameters.attribute = inData.attribute ?? "body";

    return parameters;
  }

  _calculateCheckData(inData) {
    const checkData = super._calculateCheckData(inData);
    const actorCheckData = inData.actorCheckData;

    // Get the attribute dice
    checkData.attributeDice =
      actorCheckData.attribute[this.parameters.attribute].value;

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
