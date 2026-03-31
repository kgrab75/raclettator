import { EaterSize } from '@/generated/prisma/enums';
import { z } from 'zod';

type ParticipantFormMessages = {
  name: {
    required: string;
    tooLong: string;
  };
  eaterSize: {
    required: string;
    invalid: string;
  };
  noPork: {
    required: string;
    invalid: string;
  };
  noAlcohol: {
    required: string;
    invalid: string;
  };
  isVeggie: {
    required: string;
    invalid: string;
  };
};

export function upsertParticipantFormSchema(t: ParticipantFormMessages) {
  return z.object({
    name: z.string().trim().min(1, t.name.required).max(80, t.name.tooLong),

    eaterSize: z.enum(EaterSize, {
      error: (issue) =>
        issue.input === undefined ? t.eaterSize.required : t.eaterSize.invalid,
    }),

    noPork: z.boolean({
      error: (issue) =>
        issue.input === undefined ? t.noPork.required : t.noPork.invalid,
    }),

    noAlcohol: z.boolean({
      error: (issue) =>
        issue.input === undefined ? t.noAlcohol.required : t.noAlcohol.invalid,
    }),

    isVeggie: z.boolean({
      error: (issue) =>
        issue.input === undefined ? t.isVeggie.required : t.isVeggie.invalid,
    }),
  });
}

export type ParticipantFormValues = {
  name: string;
  eaterSize: string;
  noPork: boolean;
  noAlcohol: boolean;
  isVeggie: boolean;
};

export type ParticipantFormState = {
  values: ParticipantFormValues;
  errors: null | Partial<Record<keyof ParticipantFormValues, string[]>>;
  message: string[];
  success: boolean;
};

export const emptyParticipant: ParticipantFormValues = {
  name: '',
  eaterSize: 'MEDIUM',
  noPork: false,
  noAlcohol: false,
  isVeggie: false,
};
