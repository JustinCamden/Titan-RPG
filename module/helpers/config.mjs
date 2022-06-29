export const TITAN = {
  attribute: {
    min: 1,
    max: 8,
    totalExpCostByRank: [2, 7, 14, 23, 34, 47, 62],
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
    training: {
      max: 3,
      totalExpCostByRank: [1, 3, 7],
    },
    expertise: {
      max: 3,
      totalExpCostByRank: [1, 3, 7],
    },
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
        label: "TITAN.skill.option.rangedWeapons.label",
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

  resource: {
    option: {
      resolve: {
        label: "TITAN.resource.option.resolve.label",
        maxBaseMulti: 1.0,
      },
      stamina: {
        label: "TITAN.resource.option.stamina.label",
        maxBaseMulti: 1.0,
      },
      wounds: {
        label: "TITAN.resource.option.wounds.label",
        maxBaseMulti: 1.0,
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
    name: {
      label: "TITAN.check.label",
    },
    roll: {
      label: "TITAN.check.roll.label",
    },
  },

  cancel: {
    label: "TITAN.cancel.label",
  },
  none: {
    label: "TITAN.none.label",
  },
  save: {
    label: "TITAN.save.label",
  },

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
      option: {
        melee: {
          label: "TITAN.attack.type.option.melee.label",
        },
        ranged: {
          label: "TITAN.attack.type.option.ranged.label",
        },
      },
    },
    tag: {
      option: {
        blast: {
          label: "TITAN.attack.option.blast.label",
          hasIntValue: true,
        },
        cleave: {
          label: "TITAN.attack.option.cleave.label",
        },
        close: {
          label: "TITAN.attack.option.close.label",
        },
        crushing: {
          label: "TITAN.attack.option.crushing.label",
        },
        defensive: {
          label: "TITAN.attack.option.defensive.label",
        },
        ineffective: {
          label: "TITAN.attack.option.ineffective.label",
        },
        loud: {
          label: "TITAN.attack.option.loud.label",
        },
        magical: {
          label: "TITAN.attack.option.magical.label",
        },
        penetrating: {
          label: "TITAN.attack.option.penetrating.label",
        },
        piercing: {
          label: "TITAN.attack.option.piercing.label",
        },
        range: {
          label: "TITAN.attack.option.range.label",
        },
        reach: {
          label: "TITAN.attack.option.reach.label",
        },
        reload: {
          label: "TITAN.attack.option.reload.label",
        },
        rend: {
          label: "TITAN.attack.option.rend.label",
        },
        restraining: {
          label: "TITAN.attack.option.restraining.label",
        },
        slashing: {
          label: "TITAN.attack.option.slashing.label",
        },
        spread: {
          label: "TITAN.attack.option.spread.label",
          hasIntValue: true,
        },
        subtle: {
          label: "TITAN.attack.option.subtle.label",
        },
        thrown: {
          label: "TITAN.attack.option.thrown.label",
        },
        twoHanded: {
          label: "TITAN.attack.option.twoHanded.label",
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
