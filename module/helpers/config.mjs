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
