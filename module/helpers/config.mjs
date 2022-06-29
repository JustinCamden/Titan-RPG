export const TITAN = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */

TITAN.local = {
  attribute: {
    option: {
      body: "TITAN.attribute.option.body",
      mind: "TITAN.attribute.option.mind",
      soul: "TITAN.attribute.option.soul",
    },
  },

  derivedStats: {
    option: {
      initiative: "TITAN.derivedStats.option.initiative",
      awareness: "TITAN.derivedStats.option.awareness",
      defense: "TITAN.derivedStats.option.defense",
      melee: "TITAN.derivedStats.option.melee",
      accuracy: "TITAN.derivedStats.option.accuracy",
    },
  },

  skill: {
    option: {
      arcana: "TITAN.skill.option.arcana",
      athletics: "TITAN.skill.option.athletics",
      beastHandling: "TITAN.skill.option.beastHandling",
      deception: "TITAN.skill.option.deception",
      dexterity: "TITAN.skill.option.dexterity",
      diplomacy: "TITAN.skill.option.diplomacy",
      engineering: "TITAN.skill.option.engineering",
      intimidation: "TITAN.skill.option.intimidation",
      investigation: "TITAN.skill.option.investigation",
      lore: "TITAN.skill.option.lore",
      medicine: "TITAN.skill.option.medicine",
      meleeWeapons: "TITAN.skill.option.meleeWeapons",
      perception: "TITAN.skill.option.perception",
      performance: "TITAN.skill.option.performance",
      rangedWeapons: "TITAN.skill.option.rangedWeapons",
      sleightOfHand: "TITAN.skill.option.sleightOfHand",
      stealth: "TITAN.skill.option.stealth",
      survival: "TITAN.skill.option.survival",
      theology: "TITAN.skill.option.theology",
    },
  },

  resources: {
    option: {
      resolve: "TITAN.resources.optionresolve",
      stamina: "TITAN.resources.optionstamina",
      wounds: "TITAN.resources.optionwounds",
    },
  },

  resistance: {
    option: {
      reflexes: "TITAN.resistance.option.reflexes",
      resilience: "TITAN.resistance.option.resilience",
      willpower: "TITAN.resistance.option.willpower",
    },
  },

  check: {
    name: "TITAN.check.label",
    roll: "TITAN.check.roll",
  },

  cancel: "TITAN.cancel",
  none: "TITAN.none",

  item: {
    rarity: {
      option: {
        common: "TITAN.item.rarity.option.common",
        uncommon: "TITAN.item.rarity.option.uncommon",
        rare: "TITAN.item.rarity.option.rare",
        special: "TITAN.item.rarity.option.special",
      },
    },
  },

  attack: {
    type: {
      melee: "TITAN.attack.type.melee",
      ranged: "TITAN.attack.type.ranged",
    },
  },

  range: {
    name: "name",
    option: {
      close: "TITAN.range.option.close",
      uncommon: "TITAN.range.option.short",
      medium: "TITAN.range.option.medium",
      long: "TITAN.range.option.long",
    },
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
