'use client';

import { EventCreateForm } from '@/app/ui/event/create-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export type EventProp = {
  title: string;
  location: string;
  humanizedStartsAt: string;
};

export default function MainSection() {
  const t = useTranslations('NewEvent');

  const initialEvent = {
    title: t('form.title.preview'),
    location: t('form.location.preview'),
    humanizedStartsAt: t('form.startsAt.preview'),
  };

  const [eventPreview, setEventPreview] = useState<EventProp>(initialEvent);

  return (
    <section>
      <EventCreateForm
        eventPreview={eventPreview}
        setEventPreview={setEventPreview}
      />
    </section>
  );
}
