import TitanCheck from "./check.mjs";

export default class TitanAttackCheck extends TitanCheck {
  constructor(inData) {
    super(inData);
    this.baseDamage = inData.baseDamage;
    this.plusSuccessDamage = inData.plusSuccessDamage;
  }

  // Calculates the result of the check
  _calculateResult() {
    let results = super._calculateResult();

    // If the check succeeded
    if (results.succeeded) {
      // Calculate damage
      results.damage = this.baseDamage;
      if (this.plusSuccessDamage && results.extraSuccesses) {
        results.damage = results.damage + results.extraSuccesses;
      }
    }

    this.results = results;
    return results;
  }

  _getChatTemplate() {
    return "systems/titan/templates/checks/check-attack.hbs";
  }
}
