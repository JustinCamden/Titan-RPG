export const TITAN = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */

TITAN.attributes = {
  body: "TITAN.attributes.body",
  mind: "TITAN.attributes.mind",
  soul: "TITAN.attributes.soul",
  min: 1,
  max: 8,
  totalExpCostByRank: [2, 7, 14, 23, 34, 47, 62],
};

TITAN.skills = {
  arcana: "TITAN.skills.arcana",
  athletics: "TITAN.skills.athletics",
  beastHandling: "TITAN.skills.beastHandling",
  deception: "TITAN.skills.deception",
  dexterity: "TITAN.skills.dexterity",
  diplomacy: "TITAN.skills.diplomacy",
  engineering: "TITAN.skills.engineering",
  intimidation: "TITAN.skills.intimidation",
  investigation: "TITAN.skills.investigation",
  lore: "TITAN.skills.lore",
  medicine: "TITAN.skills.medicine",
  meleeWeapons: "TITAN.skills.meleeWeapons",
  perception: "TITAN.skills.perception",
  performance: "TITAN.skills.performance",
  rangedWeapons: "TITAN.skills.rangedWeapons",
  sleightOfHand: "TITAN.skills.sleightOfHand",
  stealth: "TITAN.skills.stealth",
  survival: "TITAN.skills.survival",
  theology: "TITAN.skills.theology",
  training: {
    max: 3,
    totalExpCostByRank: [1, 3, 7],
  },
  focus: {
    max: 3,
    totalExpCostByRank: [1, 3, 7],
  },
};

TITAN.resources = {
  stamina: {
    name: "TITAN.resources.stamina",
    maxBaseMulti: 1.0,
  },

  resolve: {
    name: "TITAN.resources.Resolve",
    maxBaseMulti: 1.0,
  },

  wounds: {
    name: "TITAN.resources.wounds",
    maxBaseMulti: 1.0,
  },
};
