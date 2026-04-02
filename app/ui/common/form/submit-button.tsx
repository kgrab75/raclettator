import { Pencil, Plus } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type SubmitMode = 'create' | 'edit';

type SubmitButtonLabels = {
  create: string;
  creating: string;
  edit: string;
  editing: string;
};

type SubmitButtonProps = {
  pending: boolean;
  mode: SubmitMode;
  labels: SubmitButtonLabels;
  createIcon?: ReactNode;
  editIcon?: ReactNode;
  pendingIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
  form?: string;
};

export default function SubmitButton({
  pending,
  mode,
  labels,
  createIcon = <Plus className="h-4 w-4" />,
  editIcon = <Pencil className="h-4 w-4" />,
  pendingIcon = <Spinner data-icon="inline-start" />,
  disabled,
  className,
  form,
}: SubmitButtonProps) {
  const config = pending
    ? {
        label: mode === 'edit' ? labels.editing : labels.creating,
        icon: pendingIcon,
      }
    : mode === 'edit'
      ? {
          label: labels.edit,
          icon: editIcon,
        }
      : {
          label: labels.create,
          icon: createIcon,
        };

  return (
    <Button type="submit" disabled={pending || disabled} className={className} form={form}>
      {config.icon}
      {config.label}
    </Button>
  );
}
