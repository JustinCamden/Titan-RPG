export class TitanSpell {
  constructor(parent) {
    this.parent = parent;
  }

  calculateTargetOvercastSuccessCost(targetData) {
    // If auto calculate success cost
    if (targetData.overcast.calculateSuccessCost) {
      // Zone = 3
      if (targetData.type == "zone") {
        return 3;
      }

      // All else = 1
      return 1;
    }

    // Return current
    return targetData.overcast.successCost;
  }

  calculateDamageOvercastSuccessCost(damageData) {
    // If auto calculate success cost
    if (damageData.overcast.calculateSuccessCost) {
      // If ignore armor
      if (damageData.ignoreArmor) {
        // Resistance check = 1
        if (damageData.resistanceCheck != "none") {
          return 1;
        }

        // Normal = 2
        return 2;
      }

      // No ignore armor = 1
      return 1;
    }

    // Return current
    return damageData.overcast.successCost;
  }

  calculateHealingOvercastSuccessCost(healingData) {
    // If auto calculate success cost
    if (healingData.overcast.calculateSuccessCost) {
      // Normal = 1
      return 1;
    }

    // Return current
    return healingData.overcast.successCost;
  }

  calculateDurationOvercastSuccessCost(durationData) {
    // If auto calculate success cost
    if (durationData.overcast.calculateSuccessCost) {
      // Normal = 1
      return 1;
    }

    // Return current
    return durationData.overcast.successCost;
  }
}
