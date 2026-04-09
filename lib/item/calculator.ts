import 'server-only';
import { ItemCategory } from '@/generated/prisma/enums'
import prisma from '../prisma';
import { ROUNDING_RULES } from './constants';
import { calculateQuantities } from './calculator-logic';

export { ROUNDING_RULES };

export async function recalculateEventItems(eventId: string) {
  const participants = await prisma.participant.findMany({
    where: { eventId },
  });

  const quantities = calculateQuantities(participants);

  const systemItemsData = [
    { systemKey: 'cheese', name: 'Fromage à raclette', category: ItemCategory.WEIGHT, qty: quantities.cheese },
    { systemKey: 'potatoes', name: 'Pommes de terre', category: ItemCategory.WEIGHT, qty: quantities.potatoes },
    { systemKey: 'charcuterie', name: 'Charcuterie', category: ItemCategory.WEIGHT, qty: quantities.charcuterie },
    { systemKey: 'charcuterieVeggie', name: 'Alternative végé', category: ItemCategory.WEIGHT, qty: quantities.charcuterieVeggieAlt },
    { systemKey: 'charcuterieNoPork', name: 'Charcuterie sans porc', category: ItemCategory.WEIGHT, qty: quantities.charcuterieNoPork },
    { systemKey: 'soft', name: 'Soft (Jus, Soda etc.)', category: ItemCategory.UNIT, qty: quantities.soft },
    { systemKey: 'wine', name: 'Bouteille de vin', category: ItemCategory.UNIT, qty: quantities.wine },
    { systemKey: 'pickles', name: 'Bocal de cornichons', category: ItemCategory.UNIT, qty: quantities.pickles },
    { systemKey: 'machine', name: 'Appareil à raclette', category: ItemCategory.UNIT, qty: quantities.machine },
  ];

  for (const template of systemItemsData) {
    const existing = await prisma.item.findFirst({
      where: { eventId, systemKey: template.systemKey },
    });

    if (existing) {
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
