export const TITAN = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
TITAN.abilities = {
  str: "TITAN.AbilityStr",
  dex: "TITAN.AbilityDex",
  con: "TITAN.AbilityCon",
  int: "TITAN.AbilityInt",
  wis: "TITAN.AbilityWis",
  cha: "TITAN.AbilityCha",
};

TITAN.abilityAbbreviations = {
  str: "TITAN.AbilityStrAbbr",
  dex: "TITAN.AbilityDexAbbr",
  con: "TITAN.AbilityConAbbr",
  int: "TITAN.AbilityIntAbbr",
  wis: "TITAN.AbilityWisAbbr",
  cha: "TITAN.AbilityChaAbbr",
};

TITAN.attributes = {
  body: "TITAN.Attribute.Body",
  mind: "TITAN.Attribute.Mind",
  soul: "TITAN.Attribute.Soul",
  min: 1,
  max: 8,
  totalExpCostByRank: [2, 7, 14, 23, 34, 47, 62],
};

TITAN.skills = {
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
    name: "TITAN.Resources.Stamina",
    maxBaseMulti: 1.0,
  },

  resolve: {
    name: "TITAN.Resources.Resolve",
    maxBaseMulti: 1.0,
  },

  wounds: {
    name: "TITAN.Resources.Wounds",
    maxBaseMulti: 1.0,
  },
};
