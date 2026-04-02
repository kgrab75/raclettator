'use client';

import Form from 'next/form';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';

import SubmitButton from '@/app/ui/common/form/submit-button';
import { DateTimePicker } from '@/app/ui/common/form/dateTimePicker';
import { EventProp } from '@/app/ui/event/main-section';
import { Input } from '@/components/ui/input';
import { upsertEvent } from '@/lib/event/actions';
import { type EventFormState } from '@/lib/event/schema';
import { Calendar, MapPin, PenLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function EventCreateForm({
  eventPreview,
  setEventPreview,
  adminToken,
  event,
}: {
  eventPreview: EventProp;
  setEventPreview: Dispatch<React.SetStateAction<EventProp>>;
  adminToken?: string;
  event?: { title: string; location: string; startsAt: string };
}) {
  const t = useTranslations('NewEvent');

  const [formState, formAction, pending] = useActionState<
    EventFormState,
    FormData
  >(upsertEvent.bind(null, adminToken || null), {
    values: event || {
      title: '',
      startsAt: '',
      location: '',
    },
    errors: null,
    message: [],
    success: false,
  });

  useEffect(() => {
    if (formState.success && adminToken) {
      toast.success(t('form.submit.updateSuccess'));
    } else if (formState.message && formState.message.length > 0 && !formState.success) {
      toast.error(formState.message[0]);
    }
  }, [formState.success, formState.message, t, adminToken]);

  const [date, setDate] = useState<Date | undefined>(
    event?.startsAt ? new Date(event.startsAt) : undefined,
  );
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      selectedDate.setHours(19);
      selectedDate.setMinutes(30);

      setDate(selectedDate);
      setEventPreview({
        ...eventPreview,
        humanizedStartsAt: t('form.startsAt.previewFromDate', {
          startsAtDate: selectedDate,
          day: selectedDate.getDate(),
        }),
      });
    }
  };
  const handleTimeChange = (
    type: 'hour' | 'minute' | 'ampm',
    value: string,
    uses12hClock: boolean,
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === 'hour') {
        const hour = parseInt(value);
        if (uses12hClock) {
          newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
        } else {
          newDate.setHours(hour);
        }
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value));
      } else if (type === 'ampm') {
        const hours = newDate.getHours();
        if (value === 'AM' && hours >= 12) {
          newDate.setHours(hours - 12);
        } else if (value === 'PM' && hours < 12) {
          newDate.setHours(hours + 12);
        }
      }
      setDate(newDate);
      setEventPreview({
        ...eventPreview,
        humanizedStartsAt: t('form.startsAt.previewFromDate', {
          startsAtDate: newDate,
          day: newDate.getDate(),
        }),
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextEventPreview = {
      ...eventPreview,
      [e.currentTarget.name]: e.currentTarget.value,
    };
    setEventPreview(nextEventPreview);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{adminToken ? t('updateTitle') : t('title')}</CardTitle>
        <CardDescription>{adminToken ? t('updateDescription') : t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction} id="event-create-form">
          <FieldGroup>
            <Field data-invalid={!!formState.errors?.title?.length}>
              <FieldContent>
                <FieldTitle>
                  <PenLine className="h-4 w-4" />
                  <FieldLabel htmlFor="title" className="border-none p-0 w-fit font-semibold">{t('form.title.label')}</FieldLabel>
                </FieldTitle>
                <FieldDescription>{t('form.title.description')}</FieldDescription>
              </FieldContent>
              <Input
                id="title"
                name="title"
                defaultValue={formState.values.title}
                disabled={pending}
                aria-invalid={!!formState.errors?.title?.length}
                placeholder={t('form.title.placeholder')}
                autoComplete="off"
                onChange={handleInputChange}
              />
              {formState.errors?.title && (
                <FieldError>{formState.errors.title[0]}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!formState.errors?.location?.length}>
              <FieldContent>
                <FieldTitle>
                  <MapPin className="h-4 w-4" />
                  <FieldLabel htmlFor="location" className="border-none p-0 w-fit font-semibold">{t('form.location.label')}</FieldLabel>
                </FieldTitle>
                <FieldDescription>{t('form.location.description')}</FieldDescription>
              </FieldContent>
              <Input
                id="location"
                name="location"
                defaultValue={formState.values.location}
                disabled={pending}
                aria-invalid={!!formState.errors?.location?.length}
                placeholder={t('form.location.placeholder')}
                autoComplete="off"
                onChange={handleInputChange}
              />
              {formState.errors?.location && (
                <FieldError>{formState.errors.location[0]}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!formState.errors?.startsAt?.length}>
              <FieldContent>
                <FieldTitle>
                  <Calendar className="h-4 w-4" />
                  <FieldLabel htmlFor="startsAt" className="border-none p-0 w-fit font-semibold">{t('form.startsAt.label')}</FieldLabel>
                </FieldTitle>
                <FieldDescription>{t('form.startsAt.description')}</FieldDescription>
              </FieldContent>
              <DateTimePicker
                date={date}
                onDateChange={handleDateSelect}
                onTimeChange={handleTimeChange}
                placeholder={t('form.startsAt.placeholder')}
              />
              <Input
                id="startsAt"
                name="startsAt"
                defaultValue={date?.toISOString() || formState.values.startsAt}
                disabled={pending}
                aria-invalid={!!formState.errors?.startsAt?.length}
                placeholder={t('form.startsAt.placeholder')}
                autoComplete="off"
                type="hidden"
                onChange={handleInputChange}
              />
              {formState.errors?.startsAt && (
                <FieldError>{formState.errors.startsAt[0]}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <SubmitButton
          pending={pending}
          mode={adminToken ? 'edit' : 'create'}
          labels={{
            create: t('form.submit.create'),
            creating: t('form.submit.creating'),
            edit: t('form.submit.edit'),
            editing: t('form.submit.editing'),
          }}
          form="event-create-form"
          className="w-full sm:w-auto"
        />
      </CardFooter>
    </Card>
  );
}
