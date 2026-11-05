'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRehearsalSlots } from '@/hooks/use-rehearsal';
import { useBookingStore } from '@/stores/booking-store';
import { DrmButton } from '@/components/ui';
import { RehearsalBookingForm } from './booking-form';

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
  const availableSlots = (slotsQuery.data ?? []).filter((slot) => slot.status === 'AVAILABLE');
  const selectedSlot = availableSlots.find((slot) => slot.id === selectedSlotId);
  const isBookingDisabled = availableSlots.length === 0 || !selectedSlot;

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

  return (
    <section className="booking-area" aria-labelledby="booking-title">
      <h2 id="booking-title">Выберите дату и время</h2>
      <div className="booking-picker">
        <div className="calendar">
          <div className="calendar-head">
            <DrmButton
              aria-label="Предыдущий месяц"
              onClick={() =>
                setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
              type="button"
            >
              <ChevronLeft aria-hidden="true" />
            </DrmButton>
            <span>{monthLabel}</span>
            <DrmButton
              aria-label="Следующий месяц"
              onClick={() =>
                setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
              type="button"
            >
              <ChevronRight aria-hidden="true" />
            </DrmButton>
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
                <DrmButton
                  aria-label={new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full' }).format(date)}
                  aria-pressed={selectedDate === value}
                  className={index % 7 > 4 ? 'is-weekend' : ''}
                  disabled={isPast}
                  key={value}
                  onClick={() => {
                    setDate(value);
                    setSlot(null);
                    setShowForm(false);
                  }}
                  type="button"
                >
                  {day}
                </DrmButton>
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
              <DrmButton
                aria-pressed={selectedSlotId === slot.id}
                className="slot-button"
                key={slot.id}
                onClick={() => {
                  setSlot(slot.id);
                  setShowForm(false);
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
              </DrmButton>
            ))
          ) : (
            <p>На эту дату свободных слотов нет.</p>
          )}
          <DrmButton
            className="button button-red"
            disabled={isBookingDisabled}
            onClick={() => setShowForm(true)}
            type="button"
          >
            Записаться <span aria-hidden="true">→</span>
          </DrmButton>
        </div>
      </div>

      {showForm && selectedSlot && (
        <div
          aria-labelledby="booking-modal-title"
          aria-modal="true"
          className="booking-modal-backdrop"
          role="dialog"
        >
          <div className="booking-modal">
            <DrmButton
              aria-label="Закрыть форму записи"
              className="booking-modal-close"
              onClick={() => setShowForm(false)}
              type="button"
            >
              <X aria-hidden="true" />
            </DrmButton>
            <RehearsalBookingForm
              date={selectedDate}
              onClose={() => setShowForm(false)}
              pointSlug={pointSlug}
              slot={selectedSlot}
            />
          </div>
        </div>
      )}
    </section>
  );
}
