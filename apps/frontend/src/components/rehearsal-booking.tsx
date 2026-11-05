'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useCreateBooking, useRehearsalSlots } from '@/hooks/use-rehearsal';
import { useBookingStore } from '@/stores/booking-store';

const localDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dateFromString = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const dayRange = (value: string) => {
  const start = dateFromString(value);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { from: start.toISOString(), to: end.toISOString() };
};

export function RehearsalBooking({ pointId, pointSlug }: { pointId: string; pointSlug: string }) {
  const { selectedPointId, selectedDate, selectedSlotId, setPoint, setDate, setSlot } =
    useBookingStore();
  const [month, setMonth] = useState(() => {
    const date = dateFromString(selectedDate);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (selectedPointId !== pointId) setPoint(pointId);
  }, [pointId, selectedPointId, setPoint]);

  const { from, to } = dayRange(selectedDate);
  const slotsQuery = useRehearsalSlots(
    pointSlug,
    selectedDate,
    from,
    to,
    selectedPointId === pointId,
  );
  const bookingMutation = useCreateBooking(pointSlug, selectedDate);

  const availableSlots = (slotsQuery.data ?? []).filter((slot) => slot.status === 'AVAILABLE');
  const selectedSlot = availableSlots.find((slot) => slot.id === selectedSlotId);
  useEffect(() => {
    if (selectedSlotId && !availableSlots.some((slot) => slot.id === selectedSlotId)) setSlot(null);
  }, [availableSlots, selectedSlotId, setSlot]);

  const firstWeekday = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const monthDays: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (monthDays.length % 7) monthDays.push(null);
  const monthLabel = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  }).format(month);
  const selectedDateLabel = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(dateFromString(selectedDate));

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) {
      setFormError('Выберите свободное время.');
      return;
    }
    const form = new FormData(event.currentTarget);
    bookingMutation.mutate({
      timeSlotId: selectedSlot.id,
      customerName: String(form.get('name')),
      customerPhone: String(form.get('phone')),
      customerEmail: String(form.get('email') || '') || undefined,
      comment: String(form.get('comment') || '') || undefined,
      personalDataConsent: form.get('consent') === 'on',
    });
  }

  return (
    <section className="booking-area" aria-labelledby="booking-title">
      <h2 id="booking-title">Выберите дату и время</h2>
      <div className="booking-picker">
        <div className="calendar">
          <div className="calendar-head">
            <button
              aria-label="Предыдущий месяц"
              onClick={() =>
                setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
              type="button"
            >
              ‹
            </button>
            <span>{monthLabel}</span>
            <button
              aria-label="Следующий месяц"
              onClick={() =>
                setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
              type="button"
            >
              ›
            </button>
          </div>
          <div aria-label={`Календарь: ${monthLabel}`} className="calendar-grid" role="group">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <span key={day}>{day}</span>
            ))}
            {monthDays.map((day, index) => {
              if (!day) return <span aria-hidden="true" key={`empty-${index}`} />;
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const value = localDateString(date);
              const isPast = value < localDateString(new Date());
              return (
                <button
                  aria-label={new Intl.DateTimeFormat('ru-RU', {
                    dateStyle: 'full',
                  }).format(date)}
                  aria-pressed={selectedDate === value}
                  className={index % 7 > 4 ? 'is-weekend' : ''}
                  disabled={isPast}
                  key={value}
                  onClick={() => {
                    setDate(value);
                    bookingMutation.reset();
                    setFormError('');
                  }}
                  type="button"
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        <div className="slot-list" aria-label="Свободные временные слоты">
          {slotsQuery.isPending ? (
            <p role="status">Загружаем свободное время…</p>
          ) : slotsQuery.isError ? (
            <p role="alert">Не удалось загрузить расписание.</p>
          ) : availableSlots.length ? (
            availableSlots.map((slot) => (
              <button
                aria-pressed={selectedSlotId === slot.id}
                className="slot-button"
                key={slot.id}
                onClick={() => {
                  setSlot(slot.id);
                  bookingMutation.reset();
                  setFormError('');
                }}
                type="button"
              >
                {new Date(slot.startAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                —{' '}
                {new Date(slot.endAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </button>
            ))
          ) : (
            <p>На эту дату свободных слотов нет.</p>
          )}
          <button
            className="button button-red"
            disabled={!selectedSlot}
            onClick={() => setShowForm((visible) => !visible)}
            type="button"
          >
            Записаться <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {showForm && (selectedSlot || bookingMutation.isSuccess) && (
        <form className="booking-form" onSubmit={submitBooking}>
          <h3>
            Заявка на {selectedDateLabel}
            {selectedSlot
              ? `, ${new Date(selectedSlot.startAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
              : ''}
          </h3>
          <label>
            Ваше имя
            <input autoComplete="name" name="name" required />
          </label>
          <label>
            Телефон
            <input autoComplete="tel" name="phone" required type="tel" />
          </label>
          <label>
            Email (необязательно)
            <input autoComplete="email" name="email" type="email" />
          </label>
          <label>
            Комментарий
            <textarea name="comment" rows={3} />
          </label>
          <label className="consent">
            <input name="consent" required type="checkbox" /> Согласен на обработку персональных
            данных
          </label>
          <button
            className="button button-red"
            disabled={bookingMutation.isPending || bookingMutation.isSuccess}
            type="submit"
          >
            {bookingMutation.isPending ? 'Отправляем…' : 'Отправить заявку'}
          </button>
          {(formError || bookingMutation.error) && (
            <p role="alert">
              {formError || bookingMutation.error?.message || 'Не удалось отправить заявку.'}
            </p>
          )}
          {bookingMutation.isSuccess && (
            <p role="status">Заявка отправлена. Администратор подтвердит запись.</p>
          )}
        </form>
      )}
    </section>
  );
}
