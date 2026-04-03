'use server';

import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { emptyItem, ItemFormState, upsertItemFormSchema } from './schema';
import { checkRateLimit } from '@/lib/ratelimit';
import { RealtimeEmitter } from '@/lib/realtime/emitter';
import { ItemCategory } from '@/generated/prisma/enums';

export async function upsertItem(
  adminToken: string,
  itemId: string | undefined,
  _prevState: ItemFormState,
  formData: FormData,
) {
  const ts = await getTranslations('ServerErrors');
  
  const isAllowed = await checkRateLimit(15);
  if (!isAllowed) {
    return {
      values: { name: '', category: 'WEIGHT', requiredQuantity: '' },
      errors: {},
      message: [ts('rateLimit')],
      success: false,
    };
  }

  const t = await getTranslations('AdminItem.form');

  const schema = upsertItemFormSchema({
    name: {
      required: t('name.errors.required'),
      tooLong: t('name.errors.tooLong'),
    },
    category: {
      required: t('category.errors.required'),
      invalid: t('category.errors.invalid'),
    },
    requiredQuantity: {
      required: t('requiredQuantity.errors.required'),
      invalid: t('requiredQuantity.errors.invalid'),
    },
  });

  const values = {
    name: String(formData.get('name') ?? ''),
    category: String(formData.get('category') ?? ''),
    requiredQuantity: String(formData.get('requiredQuantity') ?? ''),
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
    const existingCount = await prisma.item.count({
      where: { event: { adminToken } }
    });
    
    // Check business limits (max 40) only on CREATION, not on update
    if (!itemId && existingCount >= 40) {
      return {
        values,
        errors: {},
        message: [ts('itemLimit')],
        success: false,
      };
    }

    const existingEvent = await prisma.event.findUnique({
      where: { adminToken },
      include: { items: { where: { id: itemId || '' } } },
    });
    
    if (!existingEvent) throw new Error("Event not found");

    if (itemId && existingEvent.items.length > 0) {
      await prisma.item.update({
        where: { id: itemId },
        data: {
          name: data.name,
          category: data.category,
          requiredQuantity: data.requiredQuantity,
          isSystem: false,
        },
      });
    } else {
      await prisma.item.create({
        data: {
          eventId: existingEvent.id,
          name: data.name,
          category: data.category,
          requiredQuantity: data.requiredQuantity,
          isSystem: false,
        },
      });
    }


    revalidatePath(`/admin/${adminToken}`);
    revalidatePath(`/${existingEvent.publicToken}`);
    RealtimeEmitter.notify(existingEvent.publicToken);

    return {
      values: { name: '', category: 'WEIGHT', requiredQuantity: '' },
      errors: {},
      message: ['Article ajouté'],
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      values,
      errors: {},
      message: ['Erreur serveur : impossible de modifier cet article.'],
      success: false,
    };
  }
}

export async function deleteItem(adminToken: string, itemId: string) {
  try {
    const event = await prisma.event.update({
      where: { adminToken },
      data: {
        items: {
          delete: {
            id: itemId,
          },
        },
      },
      select: { publicToken: true },
    });

    if (event) {
      RealtimeEmitter.notify(event.publicToken);
      revalidatePath(`/admin/${adminToken}`);
      revalidatePath(`/${event.publicToken}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addPublicItemWithContribution(
  publicToken: string,
  participantId: string,
  name: string,
  category: string,
  quantity: number
) {
  const isAllowed = await checkRateLimit(15);
  if (!isAllowed) throw new Error("Rate limit exceeded");

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { publicToken },
      include: { _count: { select: { items: true } } },
    });
    
    if (!existingEvent) throw new Error("Event not found");

    if (existingEvent._count.items >= 40) {
      throw new Error("Item limit reached");
    }

    await prisma.$transaction(async (tx) => {
      const newItem = await tx.item.create({
        data: {
          eventId: existingEvent.id,
          name,
          category: category as ItemCategory,
          requiredQuantity: quantity,
          isSystem: false,
        },
      });

      await tx.contribution.create({
        data: {
          participantId,
          itemId: newItem.id,
          quantity,
        },
      });
    });

    RealtimeEmitter.notify(publicToken);
    revalidatePath(`/${publicToken}`);
    revalidatePath(`/admin/${existingEvent.adminToken}`);
  } catch (error) {
    console.error(error);
    throw new Error("Could not add item");
  }
}
