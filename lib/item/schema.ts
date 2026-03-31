import { ItemCategory } from '@/generated/prisma/enums';
import { z } from 'zod';
import { Item } from './types';

export const emptyItem: Item = {
  id: '',
  eventId: '',
  name: '',
  category: 'WEIGHT',
  isSystem: false,
  systemKey: null,
  requiredQuantity: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export type ItemFormState = {
  values: {
    name: string;
    category: string;
    requiredQuantity: string;
  };
  errors?: {
    name?: string[];
    category?: string[];
    requiredQuantity?: string[];
  };
  message?: string[];
  success?: boolean;
};

export const upsertItemFormSchema = (translations: {
  name: { required: string; tooLong: string };
  category: { required: string; invalid: string };
  requiredQuantity: { required: string; invalid: string };
}) =>
  z.object({
    name: z
      .string()
      .min(1, { message: translations.name.required })
      .max(255, { message: translations.name.tooLong }),
    category: z.nativeEnum(ItemCategory, {
      message: translations.category.invalid
    }),
    requiredQuantity: z.coerce
      .number()
      .min(0, { message: translations.requiredQuantity.invalid }),
  });
