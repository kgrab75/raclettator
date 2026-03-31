'use server';

import { addAdminEventToken, removeAdminEventToken } from '@/lib/event/admin-events-cookie';
import { createEventFormSchema, EventFormState } from '@/lib/event/schema';
import prisma from '@/lib/prisma';
import { makeToken } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';
import { checkRateLimit } from '@/lib/ratelimit';

export async function upsertEvent(
  adminToken: string | null,
  _prevState: EventFormState,
  formData: FormData,
) {
  const ts = await getTranslations('ServerErrors');
  
  const isAllowed = await checkRateLimit(10);
  if (!isAllowed) {
    return {
      values: { title: '', startsAt: '', location: '' },
      errors: {},
      message: [ts('rateLimit')],
      success: false,
    };
  }

  const t = await getTranslations('NewEvent.form');

  const schema = createEventFormSchema({
    title: {
      required: t('title.errors.required'),
      tooLong: t('title.errors.tooLong'),
    },
    startsAt: {
      required: t('startsAt.errors.required'),
      invalid: t('startsAt.errors.invalid'),
    },
    location: {
      required: t('location.errors.required'),
      tooLong: t('location.errors.tooLong'),
    },
  });

  const values = {
    title: String(formData.get('title') ?? ''),
    startsAt: String(formData.get('startsAt') ?? ''),
    location: String(formData.get('location') ?? ''),
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

  const { title, startsAt, location } = result.data;

  let redirectToken = adminToken;

  try {
    if (adminToken) {
      await prisma.event.update({
        where: { adminToken },
        data: { title, startsAt, location },
      });
      revalidatePath(`/admin/${adminToken}`);
      return {
        values: { title, startsAt, location },
        errors: {},
        message: [],
        success: true,
      };
    } else {
      const newAdminToken = makeToken();
      const publicToken = makeToken();
      await prisma.event.create({
        data: {
          title,
          startsAt,
          location,
          publicToken,
          adminToken: newAdminToken,
        },
      });
      await addAdminEventToken(newAdminToken);
      redirectToken = newAdminToken;
    }
  } catch (error) {
    console.error(error);
    return {
      values,
      errors: {},
      message: ['Database Error: Failed to Create/Update Event.'],
      success: false,
    };
  }

  if (redirectToken) {
    redirect(`/admin/${redirectToken}/participants`);
  }

  return _prevState;
}

export async function deleteEvent(adminToken: string) {
  try {
    await prisma.event.delete({
      where: { adminToken },
    });
    await removeAdminEventToken(adminToken);
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw new Error('Failed to delete event');
  }

  // Redirect to homepage after deletion
  redirect('/');
}
