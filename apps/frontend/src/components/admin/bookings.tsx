'use client';

import { useState } from 'react';
import {
  useAdminBookingCount,
  useAdminBookings,
  useUpdateBookingStatus,
} from '@/hooks/use-admin-bookings';
import {
  DrmButton,
  DrmTable,
  DrmTableBody,
  DrmTableCell,
  DrmTableHead,
  DrmTableHeaderCell,
  DrmTableRow,
} from '@/components/ui';
import { formatBookingDate, labels } from './dashboard';
import type { Booking, BookingStatus } from '@/types/api';

export function AdminBookings() {
  const [filter, setFilter] = useState<BookingStatus | undefined>();
  const query = useAdminBookings(filter);
  const updateStatus = useUpdateBookingStatus();
  const all = useAdminBookingCount();
  const pending = useAdminBookingCount('PENDING');
  const confirmed = useAdminBookingCount('CONFIRMED');
  const rejected = useAdminBookingCount('REJECTED');
  const counts: Record<string, number | undefined> = {
    all: all.data?.meta.total,
    PENDING: pending.data?.meta.total,
    CONFIRMED: confirmed.data?.meta.total,
    REJECTED: rejected.data?.meta.total,
  };
  const bookings = query.data?.data ?? [];
  const tabs = [
    ['all', 'Все', undefined],
    ['PENDING', 'Ожидают', 'PENDING'],
    ['CONFIRMED', 'Подтверждены', 'CONFIRMED'],
    ['REJECTED', 'Отклонены', 'REJECTED'],
  ] as const;

  return (
    <>
      <h1>Заявки на бронирование</h1>
      <div className="booking-tabs">
        {tabs.map(([id, text, status]) => (
          <DrmButton
            aria-pressed={filter === status}
            key={id}
            onClick={() => setFilter(status)}
            type="button"
          >
            {text} <b>{counts[id] ?? '—'}</b>
          </DrmButton>
        ))}
      </div>
      {query.isPending ? (
        <p role="status">Загружаем заявки…</p>
      ) : query.isError ? (
        <p role="alert">{query.error.message}</p>
      ) : (
        <div className="booking-table-wrap">
          <DrmTable className="booking-table">
            <DrmTableHead>
              <DrmTableRow>
                <DrmTableHeaderCell>Дата и время</DrmTableHeaderCell>
                <DrmTableHeaderCell>Точка</DrmTableHeaderCell>
                <DrmTableHeaderCell>Клиент</DrmTableHeaderCell>
                <DrmTableHeaderCell>Статус</DrmTableHeaderCell>
                <DrmTableHeaderCell />
              </DrmTableRow>
            </DrmTableHead>
            <DrmTableBody>
              {bookings.map((booking) => (
                <BookingRow
                  booking={booking}
                  isUpdating={updateStatus.isPending}
                  key={booking.id}
                  updateStatus={updateStatus.mutate}
                />
              ))}
            </DrmTableBody>
          </DrmTable>
          {!bookings.length && <p>Заявок нет.</p>}
        </div>
      )}
    </>
  );
}

function BookingRow({
  booking,
  updateStatus,
  isUpdating,
}: {
  booking: Booking;
  updateStatus: (input: { id: string; status: BookingStatus }) => void;
  isUpdating: boolean;
}) {
  return (
    <DrmTableRow>
      <DrmTableCell>{formatBookingDate(booking)}</DrmTableCell>
      <DrmTableCell>{booking.timeSlot.rehearsalPoint.name}</DrmTableCell>
      <DrmTableCell>
        {booking.customerName}
        <small>{booking.customerPhone}</small>
      </DrmTableCell>
      <DrmTableCell>
        <span className={`status-pill ${booking.status.toLowerCase()}`}>
          {labels[booking.status]}
        </span>
      </DrmTableCell>
      <DrmTableCell>
        {booking.status === 'PENDING' && (
          <div className="table-actions">
            <DrmButton
              aria-label="Подтвердить"
              title="Подтвердить заявку"
              className="table-action accept"
              disabled={isUpdating}
              onClick={() => updateStatus({ id: booking.id, status: 'CONFIRMED' })}
              type="button"
            >
              ✓
            </DrmButton>
            <DrmButton
              aria-label="Отклонить"
              title="Отклонить заявку"
              className="table-action reject"
              disabled={isUpdating}
              onClick={() => updateStatus({ id: booking.id, status: 'REJECTED' })}
              type="button"
            >
              ×
            </DrmButton>
          </div>
        )}
      </DrmTableCell>
    </DrmTableRow>
  );
}
