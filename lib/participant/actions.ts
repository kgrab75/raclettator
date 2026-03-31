'use server';

import {
  upsertParticipantFormSchema,
  ParticipantFormState,
  emptyParticipant,
} from '@/lib/participant/schema';
import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { recalculateEventItems } from '@/lib/item/calculator';
import { checkRateLimit } from '@/lib/ratelimit';
import { RealtimeEmitter } from '@/lib/realtime/emitter';

export async function upsertParticipant(
  adminToken: string,
  participantId: string | undefined,
  _prevState: ParticipantFormState,
  formData: FormData,
) {
  const ts = await getTranslations('ServerErrors');
  
  const isAllowed = await checkRateLimit(15);
  if (!isAllowed) {
    return {
      values: emptyParticipant,
      errors: {},
      message: [ts('rateLimit')],
      success: false,
    };
  }

  const t = await getTranslations('AdminParticipant.form');

  const schema = upsertParticipantFormSchema({
    name: {
      required: t('name.errors.required'),
      tooLong: t('name.errors.tooLong'),
    },
    eaterSize: {
      required: t('eaterSize.errors.required'),
      invalid: t('eaterSize.errors.invalid'),
    },
    noPork: {
      required: t('noPork.errors.required'),
      invalid: t('noPork.errors.invalid'),
    },
    noAlcohol: {
      required: t('noPork.errors.required'),
      invalid: t('noAlcohol.errors.invalid'),
    },
    isVeggie: {
      required: t('isVeggie.errors.required'),
      invalid: t('isVeggie.errors.invalid'),
    },
  });

  const values = {
    name: String(formData.get('name') ?? ''),
    eaterSize: String(formData.get('eaterSize') ?? ''),
    noPork: formData.has('noPork'),
    noAlcohol: formData.has('noAlcohol'),
    isVeggie: formData.has('isVeggie'),
  };

  const result = schema.safeParse(values);

  if (!result.success) {
    return {
      values,
      errors: z.flattenError(result.error).fieldErrors,
      message: z.flattenError(result.error).formErrors,
      success: false,
    };
  }

  const { data } = result;

  try {
    const existingCount = await prisma.participant.count({
      where: { event: { adminToken } }
    });
    
    // Check business limits (max 20) only on CREATION, not on update
    if (!participantId && existingCount >= 20) {
      return {
        values,
        errors: {},
        message: [ts('participantLimit')],
        success: false,
      };
    }

    const event = await prisma.event.update({
      where: { adminToken },
      data: {
        participants: {
          upsert: {
            where: {
              id: participantId || '',
            },
            update: data,
            create: data,
          },
        },
      },
      select: { id: true, publicToken: true },
    });
    
    await recalculateEventItems(event.id);
    RealtimeEmitter.notify(event.publicToken);
    
    revalidatePath(`/admin/${adminToken}`);
    revalidatePath(`/${event.publicToken}`);
    return {
      values: emptyParticipant,
      errors: {},
      message: ['Participant added'],
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      values,
      errors: {},
      message: ['Database Error: Failed to add a Participant.'],
      success: false,
    };
  }
}

export async function deleteParticipant(
  adminToken: string,
  participantId: string,
) {
  try {
    const event = await prisma.event.update({
      where: { adminToken },
      data: {
        participants: {
          delete: {
            id: participantId,
          },
        },
      },
      select: { id: true, publicToken: true },
    });
    
    await recalculateEventItems(event.id);
    RealtimeEmitter.notify(event.publicToken);
    
    revalidatePath(`/admin/${adminToken}`);
    revalidatePath(`/${event.publicToken}`);
  } catch (error) {
    console.error(error);
  }
}
