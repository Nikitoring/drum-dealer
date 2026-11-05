'use client';

import Link from 'next/link';
import { Clock, LayoutList, Package } from 'lucide-react';
import { useAdminBookingCount, useAdminBookings } from '@/hooks/use-admin-bookings';
import { useAdminProducts } from '@/hooks/use-admin-products';
import type { BookingStatus } from '@/types/api';

const labels: Record<BookingStatus, string> = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждена',
  REJECTED: 'Отклонена',
  CANCELLED: 'Отменена',
};

const formatBookingDate = (booking: { timeSlot: { startAt: string; endAt: string } }) => {
  const start = new Date(booking.timeSlot.startAt);
  const end = new Date(booking.timeSlot.endAt);
  return `${start.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}, ${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
};

export { formatBookingDate, labels };

export function AdminDashboard() {
  const recent = useAdminBookings();
  const products = useAdminProducts({});
  const pending = useAdminBookingCount('PENDING');
  const totalBookings = useAdminBookingCount();
  const bookings = recent.data?.data.slice(0, 3) ?? [];

  return (
    <>
      <h1>Дашборд</h1>
      <div className="dashboard-stats">
        <article>
          <span aria-hidden="true">
            <Package />
          </span>
          <p>Товары</p>
          <strong>{products.data?.pages[0]?.meta.total ?? '—'}</strong>
        </article>
        <article>
          <span aria-hidden="true">
            <LayoutList />
          </span>
          <p>Заявки</p>
          <strong>{totalBookings.data?.meta.total ?? '—'}</strong>
        </article>
        <article>
          <span aria-hidden="true">
            <Clock />
          </span>
          <p>Ожидают</p>
          <strong className="red-number">{pending.data?.meta.total ?? '—'}</strong>
        </article>
      </div>
      <div className="dashboard-heading">
        <h2>Последние заявки</h2>
        <Link href="/admin/bookings">Все заявки →</Link>
      </div>
      {recent.isPending ? (
        <p role="status">Загружаем заявки…</p>
      ) : recent.isError ? (
        <p role="alert">{recent.error.message}</p>
      ) : (
        <div className="recent-bookings">
          {bookings.map((booking) => (
            <div key={booking.id}>
              <b>{formatBookingDate(booking)}</b>
              <span>{booking.customerName}</span>
              <em className={booking.status.toLowerCase()}>{labels[booking.status]}</em>
            </div>
          ))}
          {!bookings.length && <p>Заявок пока нет.</p>}
        </div>
      )}
    </>
  );
}
