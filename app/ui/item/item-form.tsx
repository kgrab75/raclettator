'use client';

import Form from 'next/form';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import { ItemCategory } from '@/generated/prisma/enums';
import { upsertItem } from '@/lib/item/actions';
import {
  emptyItem,
  type ItemFormState,
} from '@/lib/item/schema';
import { Item } from '@/lib/item/types';
import { AlertCircle } from 'lucide-react';
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

export default function ItemForm({
  adminToken,
  item,
  setDialogOpen,
}: {
  adminToken: string;
  item: Item | null;
  setDialogOpen: Dispatch<SetStateAction<boolean>> | ((open: boolean) => void);
}) {
  const t = useTranslations('AdminItem');

  const [formState, formAction, pending] = useActionState<
    ItemFormState,
    FormData
  >(upsertItem.bind(null, adminToken, item?.id), {
    values: item ? {
      name: item.name,
      category: item.category,
      requiredQuantity: item.requiredQuantity.toString(),
    } : { ...emptyItem, requiredQuantity: '' } as any,
    errors: {},
    message: [],
    success: false,
  });

  const [form, setForm] = useState(formState.values);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formState.success) {
      toast.success(t(!!item?.id ? 'form.submit.editSuccess' : 'form.submit.createSuccess'));
      
      if (!!item?.id) {
        setDialogOpen(false);
      } else {
        // Reset form for "chained" addition
        setForm({
          name: '',
          category: 'WEIGHT', // Default category
          requiredQuantity: '',
        });
        nameInputRef.current?.focus();
      }
    } else if (formState.message && formState.message.length > 0 && !formState.success) {
      toast.error(formState.message[0]);
    }
  }, [formState.success, formState.message, setDialogOpen, item?.id, t]);

  const isEditing = !!item?.id;

  return (
    <Form action={formAction} id="item-form">
      <FieldGroup>
        
        {isEditing && item?.isSystem && (
           <div className="bg-amber-500/15 text-amber-600 dark:text-amber-400 p-3 rounded-md flex gap-3 text-sm items-start">
             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
             <p>{t('systemWarning')}</p>
           </div>
        )}

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

        <Field data-invalid={!!formState.errors?.category?.length}>
          <FieldLabel htmlFor="category">
            {t('form.category.label')}
          </FieldLabel>
          <Select
            name="category"
            value={form.category}
            onValueChange={(value) => {
              setForm({
                ...form,
                category: value,
              });
            }}
            disabled={pending}
          >
            <SelectTrigger aria-invalid={!!formState.errors?.category?.length}>
              <SelectValue placeholder={t('form.category.label')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(ItemCategory).map((c) => {
                  const category = c as string;
                  return (
                    <SelectItem key={category} value={category}>
                      {t(`form.category.options.${category}`)}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          {formState.errors?.category && (
            <FieldError>{formState.errors.category[0]}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!formState.errors?.requiredQuantity?.length}>
          <FieldLabel htmlFor="requiredQuantity">{t('form.requiredQuantity.label')}</FieldLabel>
          <Input
            name="requiredQuantity"
            type="number"
            min="0"
            step="1" // allow decimals if it's kg? Usually we input grams, so step is 1
            value={form.requiredQuantity}
            disabled={pending}
            aria-invalid={!!formState.errors?.requiredQuantity?.length}
            placeholder={t('form.requiredQuantity.placeholder')}
            autoComplete="off"
            onChange={(e) => {
              setForm({
                ...form,
                requiredQuantity: e.target.value,
              });
            }}
          />
          {formState.errors?.requiredQuantity && (
            <FieldError>{formState.errors.requiredQuantity[0]}</FieldError>
          )}
        </Field>

      </FieldGroup>
      
      {formState.message && !formState.success && formState.message.length > 0 && (
         <p className="text-destructive text-sm mt-4 font-medium">{formState.message[0]}</p>
      )}

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
