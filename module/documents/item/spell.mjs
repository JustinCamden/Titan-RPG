import { TitanTypeComponent } from "./type-component.mjs";

export class TitanSpell extends TitanTypeComponent {
  getChatTemplate() {
    return "systems/titan/templates/item/spell/spell-chat-message.hbs";
  }

  prepareDerivedData() {
    // Get the system data
    const systemData = this.parent.system;

    // Calculate overcast and aspect costs
    // Target
    const targetData = systemData.target;
    if (targetData.overcast.calculateSuccessCost) {
      // Zone = 3
      // All else = 1
      targetData.overcast.successCost = targetData.type == "zone" ? 3 : 1;
    }

    // Damage
    const damageData = systemData.damage;
    if (damageData.overcast.calculateSuccessCost) {
      // If ignore armor
      if (damageData.ignoreArmor) {
        // Resistance check = 1
        if (damageData.resistanceCheck != "none") {
          damageData.overcast.successCost = 1;
        }

        // Normal = 2
        damageData.overcast.successCost = 2;
      }

      // No ignore armor = 1
      damageData.overcast.successCost = 1;
    }

    // Healing
    const healingData = systemData.healing;
    if (healingData.overcast.calculateSuccessCost) {
      healingData.overcast.successCost = 1;
    }

    // Duration
    const durationData = systemData.duration;
    if (durationData.overcast.calculateSuccessCost) {
      // Normal = 1
      durationData.overcast.successCost = 1;
    }

    // Condition removal
    const removeConditionData = systemData.removeCondition;
    if (removeConditionData.overcast.calculateSuccessCost) {
      removeConditionData.overcast.successCost = 2;
    }

    // Update the item
    this.parent.update({
      system: systemData,
    });

    return;
  }

  getModSkillTemplate() {
    return {
      skill: "athletics",
      initialValue: 1,
      increase: true,
      overcast: {
        enable: true,
        calculateSuccessCost: true,
        successCost: 1,
      },
    };
  }

  getModAttributeTemplate() {
    return {
      attribute: "body",
      initialValue: 1,
      increase: true,
      overcast: {
        enable: true,
        calculateSuccessCost: true,
        successCost: 1,
      },
    };
  }
}
