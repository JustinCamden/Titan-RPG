export const TITAN = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */

TITAN.local = {
  attribute: {
    body: "TITAN.attribute.body",
    mind: "TITAN.attribute.mind",
    soul: "TITAN.attribute.soul",
  },

  derivedStats: {
    initiative: "TITAN.derivedStats.initiative",
  },

  skill: {
    arcana: "TITAN.skill.arcana",
    athletics: "TITAN.skill.athletics",
    beastHandling: "TITAN.skill.beastHandling",
    deception: "TITAN.skill.deception",
    dexterity: "TITAN.skill.dexterity",
    diplomacy: "TITAN.skill.diplomacy",
    engineering: "TITAN.skill.engineering",
    intimidation: "TITAN.skill.intimidation",
    investigation: "TITAN.skill.investigation",
    lore: "TITAN.skill.lore",
    medicine: "TITAN.skill.medicine",
    meleeWeapons: "TITAN.skill.meleeWeapons",
    perception: "TITAN.skill.perception",
    performance: "TITAN.skill.performance",
    rangedWeapons: "TITAN.skill.rangedWeapons",
    sleightOfHand: "TITAN.skill.sleightOfHand",
    stealth: "TITAN.skill.stealth",
    survival: "TITAN.skill.survival",
    theology: "TITAN.skill.theology",
  },

  resolve: {
    resolve: "TITAN.resources.resolve",
    stamina: "TITAN.resources.stamina",
    wounds: "TITAN.resources.wounds",
  },

  resistance: {
    reflexes: "TITAN.resistance.reflexes",
    resilience: "TITAN.resistance.resilience",
    willpower: "TITAN.resistance.willpower",
  },

  check: {
    name: "TITAN.check.name",
    roll: "TITAN.check.roll",
  },
};

TITAN.settings = {
  attribute: {
    min: 1,
    max: 8,
    totalExpCostByRank: [2, 7, 14, 23, 34, 47, 62],
  },

  skill: {
    training: {
      max: 3,
      totalExpCostByRank: [1, 3, 7],
    },
    expertise: {
      max: 3,
      totalExpCostByRank: [1, 3, 7],
    },
  },

  resources: {
    resolve: {
      maxBaseMulti: 1.0,
    },

    stamina: {
      maxBaseMulti: 1.0,
    },

    wounds: {
      maxBaseMulti: 1.0,
    },
  },

  derivedStats: {
    initiative: {
      formula: "2d6",
    },
  },
};
