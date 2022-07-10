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

  _calculateActorData(checkData) {
    const actorData = super._calculateActorData(checkData);

    // Get the skill training and expertise values
    const skill = checkData.skill[this.parameters.skill];
    actorData.skillTrainingDice = skill.training.value;
    actorData.skillExpertise = skill.expertise.value;

    return actorData;
  }

  _calculateFinalData(actorData) {
    // Calculate the final total dice and expertise
    const finalData = super._calculateFinalData(actorData);

    // Calculate the total training dice
    const totalTrainingDice =
      actorData.skillTrainingDice + this.parameters.trainingMod;
    if (this.parameters.doubleTraining) {
      totalTrainingDice *= 2;
    }

    // Add the training dice to the total dice
    finalData.totalDice =
      this.parameters.diceMod + actorData.attributeDice + totalTrainingDice;

    // Calculcate the total expertise
    const totalExpertise =
      actorData.skillExpertise + this.parameters.expertiseMod;
    if (this.parameters.doubleExpertise) {
      totalExpertise *= 2;
    }
    finalData.totalExpertise = totalExpertise;

    return finalData;
  }
}
