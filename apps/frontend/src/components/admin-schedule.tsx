'use client';

import { useMemo, useState } from 'react';
import { useAdminSchedule, useAdminScheduleMutations } from '@/hooks/use-admin-schedule';
import type { TimeSlot } from '@/types/api';

const dayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const isoStart = (date: string) => new Date(`${date}T00:00:00`).toISOString();
const isoEnd = (date: string) => new Date(`${date}T23:59:59.999`).toISOString();
const time = (value: string) =>
  new Date(value).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
const statusLabels: Record<TimeSlot['status'], string> = {
  AVAILABLE: 'Свободно',
  PENDING: 'Ожидает',
  BOOKED: 'Забронировано',
  BLOCKED: 'Закрыто',
};

export function AdminSchedule() {
  const dates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        date.setDate(date.getDate() + index);
        return date;
      }),
    [],
  );
  const [selectedDate, setSelectedDate] = useState(dayKey(dates[0]));
  const [pointId, setPointId] = useState('all');
  const [newSlotTime, setNewSlotTime] = useState('12:00');
  const schedule = useAdminSchedule(isoStart(selectedDate), isoEnd(selectedDate));
  const mutations = useAdminScheduleMutations();
  const points =
    schedule.data?.data.filter(({ point }) => pointId === 'all' || point.id === pointId) ?? [];

  return (
    <>
      <div className="schedule-heading">
        <div>
          <h1>Расписание</h1>
          <p>Управление доступностью репетиционных слотов</p>
        </div>
      </div>
      <div className="schedule-toolbar">
        <div className="schedule-days" aria-label="Выбор даты">
          {dates.map((date) => {
            const value = dayKey(date);
            return (
              <button
                key={value}
                aria-pressed={selectedDate === value}
                onClick={() => setSelectedDate(value)}
                type="button"
              >
                <b>{date.toLocaleDateString('ru-RU', { weekday: 'short' })}</b>
                <span>{date.getDate()}</span>
              </button>
            );
          })}
        </div>
        <label className="schedule-filter">
          Точка
          <select value={pointId} onChange={(event) => setPointId(event.target.value)}>
            <option value="all">Все точки</option>
            {schedule.data?.data.map(({ point }) => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {schedule.isPending ? (
        <p role="status">Загружаем расписание…</p>
      ) : schedule.isError ? (
        <p role="alert">{schedule.error.message}</p>
      ) : (
        <div className="schedule-points">
          {points.map(({ point, slots }) => (
            <section className="schedule-point" key={point.id}>
              <div className="schedule-point-heading">
                <div>
                  <h2>{point.name}</h2>
                  <span>{point.address}</span>
                </div>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    mutations.createSlot.mutate({
                      rehearsalPointId: point.id,
                      startAt: new Date(`${selectedDate}T${newSlotTime}:00`).toISOString(),
                    });
                  }}
                >
                  <input
                    aria-label="Время нового слота"
                    type="time"
                    value={newSlotTime}
                    onChange={(event) => setNewSlotTime(event.target.value)}
                  />
                  <button
                    className="button button-red"
                    disabled={mutations.createSlot.isPending}
                    type="submit"
                  >
                    + Добавить слот
                  </button>
                </form>
              </div>
              <div className="schedule-slots">
                {slots.map((slot) => (
                  <article className={`schedule-slot ${slot.status.toLowerCase()}`} key={slot.id}>
                    <div>
                      <strong>
                        {time(slot.startAt)} – {time(slot.endAt)}
                      </strong>
                      <span>
                        {statusLabels[slot.status]}
                        {slot.bookings.length ? ` · ${slot.bookings[0].customerName}` : ''}
                      </span>
                    </div>
                    {(slot.status === 'AVAILABLE' || slot.status === 'BLOCKED') && (
                      <button
                        disabled={mutations.updateStatus.isPending}
                        onClick={() =>
                          mutations.updateStatus.mutate({
                            id: slot.id,
                            status: slot.status === 'BLOCKED' ? 'AVAILABLE' : 'BLOCKED',
                          })
                        }
                        type="button"
                      >
                        {slot.status === 'BLOCKED' ? 'Открыть' : 'Закрыть'}
                      </button>
                    )}
                  </article>
                ))}
                {!slots.length && <p>На эту дату слотов нет.</p>}
              </div>
            </section>
          ))}
          {!points.length && <p>Репетиционных точек нет.</p>}
        </div>
      )}
    </>
  );
}
