'use client';

import { Share } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EventShareCtaProps {
  publicToken: string;
  eventTitle: string;
  label: string;
  className?: string;
}

export default function EventShareCta({
  publicToken,
  eventTitle,
  label,
  className,
}: EventShareCtaProps) {
  const t = useTranslations('AdminEvent');

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${publicToken}`
    : `/${publicToken}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
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

  return (
    <button
      onClick={handleShare}
      className={cn("inline-flex items-center gap-1.5 cursor-pointer leading-none", className)}
      type="button"
    >
      <Share className="size-3" />
      {label}
    </button>
  );
}
