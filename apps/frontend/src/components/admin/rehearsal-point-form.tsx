'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { DrmButton, DrmInput, DrmTextarea } from '@/components/ui';
import { useAdminPoint, useAdminPointMutations } from '@/hooks/use-admin-schedule';
import type { RehearsalPointInput } from '@/types/api';

export function AdminRehearsalPointForm({ id }: { id: string }) {
  const query = useAdminPoint(id);
  const mutations = useAdminPointMutations(id);
  const [form, setForm] = useState<RehearsalPointInput>();
  if (query.isPending) return <p role="status">Загружаем точку…</p>;
  if (query.isError || !query.data) return <p role="alert">Не удалось загрузить точку.</p>;
  const point = query.data;
  const values = form ?? {
    name: point.name,
    address: point.address,
    description: point.description ?? '',
  };
  const setField = (key: keyof RehearsalPointInput, value: string) =>
    setForm((current) => ({ ...(current ?? values), [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutations.update.mutate(values);
  };
  return (
    <>
      <Link href="/admin/schedule">← Расписание</Link>
      <h1 className="mt-8">Редактирование точки</h1>
      <form className="admin-product-form mt-8 grid max-w-3xl gap-5" onSubmit={submit}>
        <label>
          Название
          <DrmInput
            required
            value={values.name ?? ''}
            onChange={(event) => setField('name', event.target.value)}
          />
        </label>
        <label>
          Адрес
          <DrmInput
            required
            value={values.address ?? ''}
            onChange={(event) => setField('address', event.target.value)}
          />
        </label>
        <label>
          Описание
          <DrmTextarea
            rows={5}
            value={values.description ?? ''}
            onChange={(event) => setField('description', event.target.value)}
          />
        </label>
        <PointImages point={point} mutations={mutations} />
        {mutations.update.isError && <p role="alert">{mutations.update.error.message}</p>}
        <DrmButton className="button-red" disabled={mutations.update.isPending} type="submit">
          {mutations.update.isPending ? 'Сохраняем…' : 'Сохранить'}
        </DrmButton>
      </form>
    </>
  );
}

function PointImages({
  point,
  mutations,
}: {
  point: NonNullable<ReturnType<typeof useAdminPoint>['data']>;
  mutations: ReturnType<typeof useAdminPointMutations>;
}) {
  const pointInput = useRef<HTMLInputElement>(null);
  const equipmentInput = useRef<HTMLInputElement>(null);
  const refs = { POINT: pointInput, EQUIPMENT: equipmentInput };
  return (
    <section className="point-admin-images">
      <h2>Фотографии точки и аппаратуры</h2>
      {(['POINT', 'EQUIPMENT'] as const).map((type) => {
        const images = point.images.filter((image) => image.type === type);
        const label = type === 'POINT' ? 'Фотографии точки' : 'Фотографии аппаратуры';
        return (
          <div className="point-admin-image-group" key={type}>
            <h3>{label}</h3>
            <input
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              ref={refs[type]}
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) mutations.uploadImage.mutate({ type, file });
                event.currentTarget.value = '';
              }}
            />
            <DrmButton
              className="button-outline-red"
              disabled={mutations.uploadImage.isPending || images.length >= 10}
              onClick={() => refs[type].current?.click()}
              type="button"
            >
              Загрузить фото
            </DrmButton>
            <div className="point-admin-image-grid">
              {images.map((image) => (
                <div className="product-image-preview" key={image.id}>
                  <img alt="" src={image.url} />
                  <DrmButton
                    aria-label="Удалить изображение"
                    className="product-image-delete"
                    disabled={mutations.deleteImage.isPending}
                    onClick={() => mutations.deleteImage.mutate(image.id)}
                    type="button"
                  >
                    ×
                  </DrmButton>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
