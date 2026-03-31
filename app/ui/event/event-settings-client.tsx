'use client';

import { EventCreateForm } from '@/app/ui/event/create-form';
import { EventProp } from '@/app/ui/event/main-section';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { deleteEvent } from '@/lib/event/actions';
import { CalendarClock, Share, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function EventSettingsClient({
  adminToken,
  publicToken,
  event,
}: {
  adminToken: string;
  publicToken: string;
  event: { title: string; location: string; startsAt: Date };
}) {
  const t = useTranslations('AdminEvent');
  const [isPending, startTransition] = useTransition();

  const [eventPreview, setEventPreview] = useState<EventProp>({
    title: event.title,
    location: event.location,
    humanizedStartsAt: event.startsAt.toLocaleString(), // We'll just pass humanized logic if needed
  });

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${publicToken}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/${publicToken}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: t('share.text'),
          url: publicUrl,
        });
        toast.success(t('share.toastSuccess'));
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          navigator.clipboard.writeText(publicUrl);
          toast.success(t('share.toastCopied'));
        }
      }
    } else {
      navigator.clipboard.writeText(publicUrl);
      toast.success(t('share.toastCopied'));
    }
  };

  const gcalTitle = encodeURIComponent(event.title);
  const startDate = event.startsAt.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endDateObj = new Date(event.startsAt);
  endDateObj.setHours(endDateObj.getHours() + 4);
  const endDate = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${startDate}/${endDate}&location=${encodeURIComponent(event.location)}`;

  return (
    <div className="flex flex-col gap-2">
      
      {/* CARD 1: PARTAGE */}
      <Card>
        <CardHeader>
          <CardTitle>{t('share.title')}</CardTitle>
          <CardDescription>{t('share.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm h-9"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button size="icon-lg" className='h-9 w-9' onClick={handleShare}>
              <Share className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="secondary" asChild className="w-fit">
            <a href={gcalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              {t('share.googleCalendar')}
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* CARD 2: UPDATE */}
      <EventCreateForm
        eventPreview={eventPreview}
        setEventPreview={setEventPreview}
        adminToken={adminToken}
        event={{
          title: event.title,
          location: event.location,
          startsAt: event.startsAt.toISOString(),
        }}
      />      

      {/* CARD 3: DELETE */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">{t('danger.title')}</CardTitle>
          <CardDescription>{t('danger.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                {t('danger.btnDelete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('danger.modal.title')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('danger.modal.description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('danger.modal.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(e) => {
                    e.preventDefault();
                    startTransition(() => {
                      deleteEvent(adminToken);
                    });
                  }}
                  disabled={isPending}
                >
                  {isPending ? t('danger.modal.deleting') : t('danger.modal.confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

    </div>
  );
}
