'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DrmButton, DrmInput, DrmTextarea } from '@/components/ui';
import { useCreateAdminPoint } from '@/hooks/use-admin-schedule';
import type { RehearsalPointInput } from '@/types/api';

const transliteration: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .split('')
    .map((char) => transliteration[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AdminRehearsalPointCreateForm() {
  const router = useRouter();
  const mutation = useCreateAdminPoint();
  const [values, setValues] = useState({
    name: '',
    slug: '',
    address: '',
    description: '',
    equipment: '',
    contactPhone: '',
    pricePerHour: '',
  });
  const generatedSlug = useMemo(() => createSlug(values.name), [values.name]);
  const [slugEdited, setSlugEdited] = useState(false);
  const slug = slugEdited ? values.slug : generatedSlug;

  function setField(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input: RehearsalPointInput & { slug: string } = {
      name: values.name.trim(),
      slug: slug.trim(),
      address: values.address.trim(),
      ...(values.description.trim() ? { description: values.description.trim() } : {}),
      ...(values.equipment.trim() ? { equipment: values.equipment.trim() } : {}),
      ...(values.contactPhone.trim() ? { contactPhone: values.contactPhone.trim() } : {}),
      ...(values.pricePerHour.trim() ? { pricePerHour: values.pricePerHour.trim() } : {}),
    };
    mutation.mutate(input, {
      onSuccess: (point) => router.push(`/admin/rehearsal-points/${point.id}/edit`),
    });
  }

  return (
    <>
      <Link href="/admin/schedule">← Расписание</Link>
      <h1 className="mt-8">Новая репетиционная точка</h1>
      <form className="admin-product-form mt-8 grid max-w-3xl gap-5" onSubmit={submit}>
        <label>
          Название
          <DrmInput
            required
            value={values.name}
            onChange={(event) => setField('name', event.target.value)}
          />
        </label>
        <label>
          URL (slug)
          <DrmInput
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setField('slug', event.target.value);
            }}
          />
        </label>
        <label>
          Адрес
          <DrmInput
            required
            value={values.address}
            onChange={(event) => setField('address', event.target.value)}
          />
        </label>
        <label>
          Описание
          <DrmTextarea
            rows={5}
            value={values.description}
            onChange={(event) => setField('description', event.target.value)}
          />
        </label>
        <label>
          Оборудование
          <DrmTextarea
            rows={4}
            value={values.equipment}
            onChange={(event) => setField('equipment', event.target.value)}
          />
        </label>
        <label>
          Телефон
          <DrmInput
            type="tel"
            value={values.contactPhone}
            onChange={(event) => setField('contactPhone', event.target.value)}
          />
        </label>
        <label>
          Стоимость часа, ₽
          <DrmInput
            min="0"
            step="0.01"
            type="number"
            value={values.pricePerHour}
            onChange={(event) => setField('pricePerHour', event.target.value)}
          />
        </label>
        {mutation.isError && <p role="alert">{mutation.error.message}</p>}
        <div className="flex flex-wrap gap-3">
          <DrmButton
            className="button-red"
            disabled={mutation.isPending || !slug.trim()}
            type="submit"
          >
            {mutation.isPending ? 'Создаём…' : 'Создать точку'}
          </DrmButton>
          <Link className="button button-outline-red" href="/admin/schedule">
            Отмена
          </Link>
        </div>
      </form>
    </>
  );
}
