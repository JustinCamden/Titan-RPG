export const TITAN = {};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */

TITAN.local = {
  attribute: {
    option: {
      body: {
        label: "TITAN.attribute.option.body.label",
      },
      mind: {
        label: "TITAN.attribute.option.mind.label",
      },
      soul: {
        label: "TITAN.attribute.option.soul.label",
      },
    },
  },

  derivedStats: {
    option: {
      initiative: {
        label: "TITAN.derivedStats.option.initiative.label",
      },
      awareness: {
        label: "TITAN.derivedStats.option.awareness.label",
      },
      defense: {
        label: "TITAN.derivedStats.option.defense.label",
      },
      melee: {
        label: "TITAN.derivedStats.option.melee.label",
      },
      accuracy: {
        label: "TITAN.derivedStats.option.accuracy.label",
      },
    },
  },

  skill: {
    option: {
      arcana: {
        label: "TITAN.skill.option.arcana.label",
      },
      athletics: {
        label: "TITAN.skill.option.athletics.label",
      },
      beastHandling: {
        label: "TITAN.skill.option.beastHandling.label",
      },
      deception: {
        label: "TITAN.skill.option.deception.label",
      },
      dexterity: {
        label: "TITAN.skill.option.dexterity.label",
      },
      diplomacy: {
        label: "TITAN.skill.option.diplomacy.label",
      },
      engineering: {
        label: "TITAN.skill.option.engineering.label",
      },
      intimidation: {
        label: "TITAN.skill.option.intimidation.label",
      },
      investigation: {
        label: "TITAN.skill.option.investigation.label",
      },
      lore: {
        label: "TITAN.skill.option.lore.label",
      },
      medicine: {
        label: "TITAN.skill.option.medicine.label",
      },
      meleeWeapons: {
        label: "TITAN.skill.option.meleeWeapons.label",
      },
      perception: {
        label: "TITAN.skill.option.perception.label",
      },
      performance: {
        label: "TITAN.skill.option.performance.label",
      },
      rangedWeapons: {
        label: "TITAN.skill.option.rangedWeapon.label",
      },
      sleightOfHand: {
        label: "TITAN.skill.option.sleightOfHand.label",
      },
      stealth: {
        label: "TITAN.skill.option.stealth.label",
      },
      survival: {
        label: "TITAN.skill.option.survival.label",
      },
      theology: {
        label: "TITAN.skill.option.theology.label",
      },
    },
  },

  resources: {
    option: {
      resolve: {
        label: "TITAN.resources.option.resolve.label",
      },
      stamina: {
        label: "TITAN.resources.option.stamina.label",
      },
      wounds: {
        label: "TITAN.resources.option.wounds.label",
      },
    },
  },

  resistance: {
    option: {
      reflexes: {
        label: "TITAN.resistance.option.reflexes.label",
      },
      resilience: {
        label: "TITAN.resistance.option.resilience.label",
      },
      willpower: {
        label: "TITAN.resistance.option.willpower.label",
      },
    },
  },

  check: {
    name: "TITAN.check.label",
    roll: "TITAN.check.roll.label",
  },

  cancel: "TITAN.cancel.label",
  none: "TITAN.none.label",

  item: {
    rarity: {
      option: {
        common: {
          label: "TITAN.item.rarity.option.common.label",
        },
        uncommon: {
          label: "TITAN.item.rarity.option.uncommon.label",
        },
        rare: {
          label: "TITAN.item.rarity.option.rare.label",
        },
        special: {
          label: "TITAN.item.rarity.option.special.label",
        },
      },
    },
  },

  attack: {
    type: {
      options: {
        melee: {
          label: "TITAN.attack.type.melee.label",
        },
        ranged: {
          label: "TITAN.attack.type.ranged.label",
        },
      },
    },
    tag: {
      option: {
        blast: {
          label: "TITAN.attack.option.blast.label",
        },
        bludgeoning: {
          label: "TITAN.attack.option.bludgeoning",
        },
        cleave: {
          label: "TITAN.attack.option.cleave",
        },
        close: {
          label: "TITAN.attack.option.close.label",
        },
        magical: {
          label: "TITAN.attack.option.magical",
        },
        piercing: {
          label: "TITAN.attack.option.piercing",
        },
        slashing: {
          label: "TITAN.attack.option.slashing",
        },
      },
    },
  },

  range: {
    name: "name",
    option: {
      close: {
        label: "TITAN.range.option.close.label",
      },
      uncommon: {
        label: "TITAN.range.option.short.label",
      },
      medium: {
        label: "TITAN.range.option.medium.label",
      },
      long: {
        label: "TITAN.range.option.long.label",
      },
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
};
