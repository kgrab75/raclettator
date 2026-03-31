import 'server-only';
import { ItemCategory } from '@/generated/prisma/enums'
import prisma from '../prisma';
import { ROUNDING_RULES } from './constants';

export { ROUNDING_RULES };

const CHEESE_RULES = { SMALL: 150, MEDIUM: 200, XL: 250 } as const;
const CHARCUTERIE_RULES = { SMALL: 100, MEDIUM: 150, XL: 200 } as const;
// Règle estimée par défaut pour les patates, car la valeur de base n'était pas précisée.
const POTATOES_RULES = { SMALL: 200, MEDIUM: 300, XL: 400 } as const;

const BOTTLES_RULES = {
  peoplePerSoft: 4,
  drinkersPerWine: 3,
};

const POTS_RULES = {
  peoplePerPicklesPot: 10,
};

function roundUp(value: number, multiple: number): number {
  if (value === 0) return 0;
  return Math.ceil(value / multiple) * multiple;
}

export async function recalculateEventItems(eventId: string) {
  const participants = await prisma.participant.findMany({
    where: { eventId },
  });

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

  const quantities = {
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

  const systemItemsData = [
    { systemKey: 'cheese', name: 'Fromage à raclette', category: ItemCategory.WEIGHT, qty: quantities.cheese },
    { systemKey: 'potatoes', name: 'Pommes de terre', category: ItemCategory.WEIGHT, qty: quantities.potatoes },
    { systemKey: 'charcuterie', name: 'Charcuterie', category: ItemCategory.WEIGHT, qty: quantities.charcuterie },
    { systemKey: 'charcuterieVeggie', name: 'Alternative Végétarienne', category: ItemCategory.WEIGHT, qty: quantities.charcuterieVeggieAlt },
    { systemKey: 'charcuterieNoPork', name: 'Charcuterie sans porc', category: ItemCategory.WEIGHT, qty: quantities.charcuterieNoPork },
    { systemKey: 'soft', name: 'Softs (Jus, Soda etc.)', category: ItemCategory.UNIT, qty: quantities.soft },
    { systemKey: 'wine', name: 'Bouteille de vin', category: ItemCategory.UNIT, qty: quantities.wine },
    { systemKey: 'pickles', name: 'Bocal de cornichons', category: ItemCategory.UNIT, qty: quantities.pickles },
    { systemKey: 'machine', name: 'Appareil à raclette', category: ItemCategory.UNIT, qty: quantities.machine },
  ];

  for (const template of systemItemsData) {
    const existing = await prisma.item.findFirst({
      where: { eventId, systemKey: template.systemKey },
    });

    if (existing) {
      // Option C: Update only if it's still a system item
      // Also, if the new quantity is 0, we can either set to 0 or leave it. Let's set it to 0 so it disappears from UI or shows 0 needed.
      if (existing.isSystem && existing.requiredQuantity !== template.qty) {
        await prisma.item.update({
          where: { id: existing.id },
          data: { requiredQuantity: template.qty },
        });
      }
    } else if (template.qty > 0) {
      await prisma.item.create({
        data: {
          eventId,
          name: template.name,
          category: template.category,
          systemKey: template.systemKey,
          isSystem: true,
          requiredQuantity: template.qty,
        },
      });
    }
  }
}
