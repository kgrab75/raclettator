'use client';

import Form from 'next/form';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { EaterSize } from '@/generated/prisma/enums';
import { upsertParticipant } from '@/lib/participant/actions';
import {
  emptyParticipant,
  ParticipantFormValues,
  type ParticipantFormState,
} from '@/lib/participant/schema';
import { Participant } from '@/lib/participant/types';
import { Ham } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

export default function ParticipantForm({
  adminToken,
  participant,
  setDialogOpen,
}: {
  adminToken: string;
  participant: Participant | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>> | ((open: boolean) => void);
}) {
  const t = useTranslations('AdminParticipant');

  const [formState, formAction, pending] = useActionState<
    ParticipantFormState,
    FormData
  >(upsertParticipant.bind(null, adminToken, participant?.id), {
    values: participant ?? emptyParticipant,
    errors: null,
    message: [],
    success: false,
  });

  const [form, setForm] = useState(formState.values);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formState.success) {
      toast.success(
        t(
          !!participant?.id
            ? 'form.submit.editSuccess'
            : 'form.submit.createSuccess'
        )
      );

      if (!!participant?.id) {
        setDialogOpen(false);
      } else {
        setForm(emptyParticipant);
        nameInputRef.current?.focus();
      }
    } else if (
      formState.message &&
      formState.message.length > 0 &&
      !formState.success
    ) {
      toast.error(formState.message[0]);
    }
  }, [formState.success, formState.message, setDialogOpen, participant?.id, t]);

  const isEditing = !!participant?.id;

  return (
    <Form action={formAction} id="event-create-form">
      <FieldGroup>
        <Field data-invalid={!!formState.errors?.name?.length}>
          <FieldLabel htmlFor="name">{t('form.name.label')}</FieldLabel>
          <Input
            ref={nameInputRef}
            name="name"
            value={form.name}
            disabled={pending}
            aria-invalid={!!formState.errors?.name?.length}
            placeholder={t('form.name.placeholder')}
            autoComplete="off"
            onChange={(e) => {
              setForm({
                ...form,
                name: e.target.value,
              });
            }}
          />
          {formState.errors?.name && (
            <FieldError>{formState.errors.name[0]}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!formState.errors?.eaterSize?.length}>
          <FieldLabel htmlFor="eaterSize">
            {t('form.eaterSize.label')}
          </FieldLabel>
          <Select
            name="eaterSize"
            value={form.eaterSize}
            onValueChange={(value: EaterSize) => {
              setForm({
                ...form,
                eaterSize: value,
              });
            }}
            disabled={pending}
          >
            <SelectTrigger aria-invalid={!!formState.errors?.eaterSize?.length}>
              <SelectValue placeholder={t('form.eaterSize.label')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(EaterSize).map((eaterSize) => {
                  return (
                    <SelectItem key={eaterSize} value={eaterSize}>
                      {t(`form.eaterSize.options.${eaterSize}`)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          {formState.errors?.eaterSize && (
            <FieldError>{formState.errors.eaterSize[0]}</FieldError>
          )}
        </Field>

        <Separator />

        {fieldTypes.map((field) => (
          <ParticularitySwitch
            key={field}
            field={field}
            t={t}
            form={form}
            setForm={setForm}
          />
        ))}
      </FieldGroup>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end py-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setDialogOpen(false)}
        >
          {t('form.cancel')}
        </Button>
        <SubmitButton
          pending={pending}
          mode={isEditing ? 'edit' : 'create'}
          labels={{
            create: t('form.submit.create'),
            creating: t('form.submit.creating'),
            edit: t('form.submit.edit'),
            editing: t('form.submit.editing'),
          }}
        />
      </div>
    </Form>
  );
}

const fieldTypes = ['noPork', 'noAlcohol', 'isVeggie'] as const;
type FieldType = (typeof fieldTypes)[number];

function ParticularitySwitch({
  field,
  t,
  form,
  setForm,
}: {
  field: FieldType;
  t: (key: string, values?: Record<string, string>) => string;
  form: ParticipantFormValues;
  setForm: Dispatch<SetStateAction<ParticipantFormValues>>;
}) {
  const description = t(
    form.name
      ? 'form.common.description.named'
      : 'form.common.description.unnamed',
    {
      name: form.name,
      subject: t('form.common.description.subject'),
      status: t(
        form[field]
          ? `form.${field}.status.checked`
          : `form.${field}.status.notChecked`,
      ),
    },
  );

  return (
    <FieldLabel htmlFor={field}>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>
            <Ham className="h-4 w-4" />
            {t(`form.${field}.label`)}
          </FieldTitle>
          <FieldDescription>{description}</FieldDescription>
        </FieldContent>
        <Switch
          id={field}
          name={field}
          onCheckedChange={(checked) => {
            setForm({
              ...form,
              [field]: checked,
            });
          }}
          checked={form[field]}
        />
      </Field>
    </FieldLabel>
  );
}
