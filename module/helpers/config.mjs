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
  max: 8,
  min: 1,
  expCostByRank: [2, 7, 14, 23, 34, 47, 62],
};

TITAN.resources = {
  maxStaminaMulti: 1.0,
};
