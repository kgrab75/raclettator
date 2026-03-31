import { z } from 'zod';

type EventFormMessages = {
  title: {
    required: string;
    tooLong: string;
  };
  startsAt: {
    required: string;
    invalid: string;
  };
  location: {
    required: string;
    tooLong: string;
  };
};

export function createEventFormSchema(t: EventFormMessages) {
  return z.object({
    title: z.string().trim().min(1, t.title.required).max(80, t.title.tooLong),

    startsAt: z
      .string()
      .trim()
      .min(1, t.startsAt.required)
      .refine((s) => !Number.isNaN(new Date(s).getTime()), t.startsAt.invalid),

    location: z
      .string()
      .trim()
      .min(1, t.location.required)
      .max(120, t.location.tooLong),
  });
}

export type EventFormValues = {
  title: string;
  startsAt: string;
  location: string;
};

export type EventFormState = {
  values: EventFormValues;
  errors: null | Partial<Record<keyof EventFormValues, string[]>>;
  message: string[];
  success: boolean;
};
