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
        } else {
          // Normal = 2
          damageData.overcast.successCost = 2;
        }
      } else {
        // No ignore armor = 1
        damageData.overcast.successCost = 1;
      }
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
    if (removeConditionData.any.overcast.calculateSuccessCost) {
      removeConditionData.any.overcast.successCost = 2;
    }

    // Increase Skill
    const increaseSkillData = systemData.increaseSkill;
    if (increaseSkillData.overcast.calculateSuccessCost) {
      // Cont the number of skills increase
      let skillIncreases = increaseSkillData.choose;
      for (let [k, v] of Object.entries(increaseSkillData.skill)) {
        if (v == true) {
          skillIncreases += 1;
        }
      }
      increaseSkillData.overcast.successCost = skillIncreases;
    }

    // Decrease Skill
    const decreaseSkillData = systemData.decreaseSkill;
    if (decreaseSkillData.overcast.calculateSuccessCost) {
      // Cont the number of skills Decrease
      let skillDecreases = decreaseSkillData.choose;
      for (let [k, v] of Object.entries(decreaseSkillData.skill)) {
        if (v == true) {
          skillDecreases += 1;
        }
      }
      decreaseSkillData.overcast.successCost = skillDecreases;
    }

    // Increase Resistance
    const increaseResistanceData = systemData.increaseResistance;
    if (increaseResistanceData.overcast.calculateSuccessCost) {
      // Cont the number of resistances increase
      let resistanceIncreases = increaseResistanceData.choose;
      for (let [k, v] of Object.entries(increaseResistanceData.resistance)) {
        if (v == true) {
          resistanceIncreases += 1;
        }
      }
      increaseResistanceData.overcast.successCost = resistanceIncreases;
    }

    // Decrease Resistance
    const decreaseResistanceData = systemData.decreaseResistance;
    if (decreaseResistanceData.overcast.calculateSuccessCost) {
      // Cont the number of resistances Decrease
      let resistanceDecreases = decreaseResistanceData.choose;
      for (let [k, v] of Object.entries(decreaseResistanceData.resistance)) {
        if (v == true) {
          resistanceDecreases += 1;
        }
      }
      decreaseResistanceData.overcast.successCost = resistanceDecreases;
    }

    // Increase Attribute
    const increaseAttributeData = systemData.increaseAttribute;
    if (increaseAttributeData.overcast.calculateSuccessCost) {
      // Cont the number of attributes increase
      let attributeIncreases = increaseAttributeData.choose;
      for (let [k, v] of Object.entries(increaseAttributeData.attribute)) {
        if (v == true) {
          attributeIncreases += 1;
        }
      }
      increaseAttributeData.overcast.successCost = attributeIncreases * 4;
    }

    // Decrease Attribute
    const decreaseAttributeData = systemData.decreaseAttribute;
    if (decreaseAttributeData.overcast.calculateSuccessCost) {
      // Cont the number of attributes Decrease
      let attributeDecreases = decreaseAttributeData.choose;
      for (let [k, v] of Object.entries(decreaseAttributeData.attribute)) {
        if (v == true) {
          attributeDecreases += 1;
        }
      }
      decreaseAttributeData.overcast.successCost = attributeDecreases * 4;
    }

    // Increase Rating
    const increaseRatingData = systemData.increaseRating;
    if (increaseRatingData.overcast.calculateSuccessCost) {
      // Cont the number of ratings increase
      let ratingIncreases = increaseRatingData.choose;
      for (let [k, v] of Object.entries(increaseRatingData.rating)) {
        if (v == true) {
          ratingIncreases += 1;
        }
      }
      increaseRatingData.overcast.successCost = ratingIncreases;
    }

    // Decrease Rating
    const decreaseRatingData = systemData.decreaseRating;
    if (decreaseRatingData.overcast.calculateSuccessCost) {
      // Cont the number of ratings Decrease
      let ratingDecreases = decreaseRatingData.choose;
      for (let [k, v] of Object.entries(decreaseRatingData.rating)) {
        if (v == true) {
          ratingDecreases += 1;
        }
      }
      decreaseRatingData.overcast.successCost = ratingDecreases;
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
