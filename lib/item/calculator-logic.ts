import { ROUNDING_RULES } from './constants';

const CHEESE_RULES = { SMALL: 150, MEDIUM: 200, XL: 250 } as const;
const CHARCUTERIE_RULES = { SMALL: 100, MEDIUM: 150, XL: 200 } as const;
const POTATOES_RULES = { SMALL: 200, MEDIUM: 300, XL: 400 } as const;

const BOTTLES_RULES = {
  peoplePerSoft: 4,
  drinkersPerWine: 3,
};

const POTS_RULES = {
  peoplePerPicklesPot: 10,
};

export function roundUp(value: number, multiple: number): number {
  if (value === 0) return 0;
  return Math.ceil(value / multiple) * multiple;
}

export type ParticipantInput = {
  eaterSize: string;
  isVeggie: boolean;
  noPork: boolean;
  noAlcohol: boolean;
};

export function calculateQuantities(participants: ParticipantInput[]) {
  const totalParticipants = participants.length;

  let rawCheese = 0;
  let rawCharcuterieClassic = 0;
  let rawCharcuterieVeggie = 0;
  let rawCharcuterieNoPork = 0;
  let rawPotatoes = 0;
  let drinkers = 0;

  for (const p of participants) {
    const size = p.eaterSize as 'SMALL' | 'MEDIUM' | 'XL';
    
    // Cheese
    rawCheese += CHEESE_RULES[size] || 0;
    
    // Potatoes
    rawPotatoes += POTATOES_RULES[size] || 0;
    
    // Charcuterie
    const cAmount = CHARCUTERIE_RULES[size] || 0;
    if (p.isVeggie) {
      rawCharcuterieVeggie += cAmount;
    } else if (p.noPork) {
      rawCharcuterieNoPork += cAmount;
    } else {
      rawCharcuterieClassic += cAmount;
    }

    // Drinks
    if (!p.noAlcohol) {
      drinkers += 1;
    }
  }

  return {
    cheese: roundUp(rawCheese, ROUNDING_RULES.cheese),
    potatoes: roundUp(rawPotatoes, ROUNDING_RULES.potatoes),
    charcuterie: roundUp(rawCharcuterieClassic, ROUNDING_RULES.charcuterie),
    charcuterieVeggieAlt: roundUp(rawCharcuterieVeggie, ROUNDING_RULES.charcuterieVeggieAlt),
    charcuterieNoPork: roundUp(rawCharcuterieNoPork, ROUNDING_RULES.charcuterieNoPork),
    soft: totalParticipants > 0 ? Math.ceil(totalParticipants / BOTTLES_RULES.peoplePerSoft) : 0,
    wine: drinkers > 0 ? Math.ceil(drinkers / BOTTLES_RULES.drinkersPerWine) : 0,
    pickles: totalParticipants > 0 ? Math.ceil(totalParticipants / POTS_RULES.peoplePerPicklesPot) : 0,
    machine: Math.ceil(totalParticipants / 6),
  };
}
