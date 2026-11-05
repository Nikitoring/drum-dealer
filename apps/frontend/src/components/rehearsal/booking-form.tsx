'use client';

import { useState, type FormEvent } from 'react';
import { useCreateBooking } from '@/hooks/use-rehearsal';
import { DrmButton, DrmCheckbox, DrmInput, DrmTextarea } from '@/components/ui';
import type { TimeSlot } from '@/types/api';

export function RehearsalBookingForm({
  date,
  onClose,
  pointSlug,
  slot,
}: {
  date: string;
  onClose: () => void;
  pointSlug: string;
  slot: TimeSlot;
}) {
  const bookingMutation = useCreateBooking(pointSlug, date);
  const [formError, setFormError] = useState('');
  const selectedDateLabel = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${date}T00:00:00`));
  const timeLabel = new Date(slot.startAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    const form = new FormData(event.currentTarget);
    bookingMutation.mutate({
      timeSlotId: slot.id,
      customerName: String(form.get('name')),
      customerPhone: String(form.get('phone')),
      customerEmail: String(form.get('email') || '') || undefined,
      comment: String(form.get('comment') || '') || undefined,
      personalDataConsent: form.get('consent') === 'on',
    });
  }

  return (
    <form className="booking-form" onSubmit={submitBooking}>
      <h3 id="booking-modal-title">
        Заявка на {selectedDateLabel}, {timeLabel}
      </h3>
      <label>
        Ваше имя
        <DrmInput autoComplete="name" name="name" required />
      </label>
      <label>
        Телефон
        <DrmInput autoComplete="tel" name="phone" required type="tel" />
      </label>
      <label>
        Email (необязательно)
        <DrmInput autoComplete="email" name="email" type="email" />
      </label>
      <label>
        Комментарий
        <DrmTextarea name="comment" rows={3} />
      </label>
      <label className="consent">
        <DrmCheckbox name="consent" required /> Согласен на обработку персональных данных
      </label>
      <div className="booking-form-actions">
        <DrmButton
          className="button-red"
          disabled={bookingMutation.isPending || bookingMutation.isSuccess}
          type="submit"
        >
          {bookingMutation.isPending ? 'Отправляем…' : 'Отправить заявку'}
        </DrmButton>
        <DrmButton className="button-outline" onClick={onClose} type="button">
          Отмена
        </DrmButton>
      </div>
      {(formError || bookingMutation.error) && (
        <p role="alert">
          {formError || bookingMutation.error?.message || 'Не удалось отправить заявку.'}
        </p>
      )}
      {bookingMutation.isSuccess && (
        <p role="status">Заявка отправлена. Администратор подтвердит запись.</p>
      )}
    </form>
  );
}
