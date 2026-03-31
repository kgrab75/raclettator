'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { RealtimeEmitter } from '@/lib/realtime/emitter';

export async function upsertPublicContribution(
  publicToken: string,
  participantId: string,
  itemId: string,
  quantity: number
) {
  const ts = await getTranslations('ServerErrors');
  
  // Rate Limit check (15 per minute)
  const isAllowed = await checkRateLimit(15);
  if (!isAllowed) {
    throw new Error(ts('rateLimit'));
  }

  try {
    // Verify participant and item belong to the same event
    const event = await prisma.event.findUnique({
      where: { publicToken },
      include: {
        participants: { where: { id: participantId } },
        items: { where: { id: itemId } }
      }
    });

    if (!event || event.participants.length === 0 || event.items.length === 0) {
      throw new Error('Invalid request: Event, participant or item not found.');
    }

    if (quantity <= 0) {
      // Delete contribution if quantity is 0
      await prisma.contribution.deleteMany({
        where: {
          itemId,
          participantId
        }
      });
    } else {
      // Upsert contribution
      await prisma.contribution.upsert({
        where: {
          itemId_participantId: {
            itemId,
            participantId
          }
        },
        update: { quantity },
        create: {
          itemId,
          participantId,
          quantity
        }
      });
    }


    revalidatePath(`/${publicToken}`);
    RealtimeEmitter.notify(publicToken);
    return { success: true };
  } catch (error) {
    console.error('Contribution Error:', error);
    throw error;
  }
}
