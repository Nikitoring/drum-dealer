'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useAdminBookingCount,
  useAdminBookings,
  useUpdateBookingStatus,
} from '@/hooks/use-admin-bookings';
import { useAdminProducts } from '@/hooks/use-admin-products';
import { clearAdminToken } from '@/lib/auth';
import type { Booking, BookingStatus } from '@/types/api';

const labels: Record<BookingStatus, string> = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждена',
  REJECTED: 'Отклонена',
  CANCELLED: 'Отменена',
};

const formatBookingDate = (booking: Booking) => {
  const start = new Date(booking.timeSlot.startAt);
  const end = new Date(booking.timeSlot.endAt);
  return `${start.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}, ${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
};

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
          <span>◇</span>
          <p>Товары</p>
          <strong>{products.data?.pages[0]?.meta.total ?? '—'}</strong>
        </article>
        <article>
          <span>▣</span>
          <p>Заявки</p>
          <strong>{totalBookings.data?.meta.total ?? '—'}</strong>
        </article>
        <article>
          <span>◷</span>
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
          <button
            aria-pressed={filter === status}
            key={id}
            onClick={() => setFilter(status)}
            type="button"
          >
            {text} <b>{counts[id] ?? '—'}</b>
          </button>
        ))}
      </div>
      {query.isPending ? (
        <p role="status">Загружаем заявки…</p>
      ) : query.isError ? (
        <p role="alert">{query.error.message}</p>
      ) : (
        <div className="booking-table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Дата и время</th>
                <th>Точка</th>
                <th>Клиент</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <BookingRow
                  booking={booking}
                  isUpdating={updateStatus.isPending}
                  key={booking.id}
                  updateStatus={updateStatus.mutate}
                />
              ))}
            </tbody>
          </table>
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
    <tr>
      <td>{formatBookingDate(booking)}</td>
      <td>{booking.timeSlot.rehearsalPoint.name}</td>
      <td>
        {booking.customerName}
        <small>{booking.customerPhone}</small>
      </td>
      <td>
        <span className={`status-pill ${booking.status.toLowerCase()}`}>
          {labels[booking.status]}
        </span>
      </td>
      <td>
        {booking.status === 'PENDING' && (
          <div className="table-actions">
            <button
              aria-label="Подтвердить"
              className="table-action accept"
              disabled={isUpdating}
              onClick={() => updateStatus({ id: booking.id, status: 'CONFIRMED' })}
              type="button"
            >
              ✓
            </button>
            <button
              aria-label="Отклонить"
              className="table-action reject"
              disabled={isUpdating}
              onClick={() => updateStatus({ id: booking.id, status: 'REJECTED' })}
              type="button"
            >
              ×
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export function AdminPanel({
  active = 'bookings',
  children,
}: {
  active?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const menu = [
    { icon: '⌂', label: 'Дашборд', href: '/admin/dashboard', id: 'dashboard' },
    { icon: '▣', label: 'Заявки', href: '/admin/bookings', id: 'bookings' },
    { icon: '▤', label: 'Расписание', href: '/admin/schedule', id: 'schedule' },
    { icon: '◇', label: 'Товары', href: '/admin/products', id: 'products' },
    { icon: '⚙', label: 'Настройки', href: '/admin/dashboard', id: 'settings' },
  ];
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin/dashboard">
          <span className="brand-mark">×</span>
          <span>
            DRUM
            <br />
            DEALER
          </span>
        </Link>
        <nav aria-label="Административная навигация" className="admin-menu">
          {menu.map((item) => (
            <Link
              aria-current={item.id === active ? 'page' : undefined}
              href={item.href}
              key={item.label}
            >
              <span className="admin-menu-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="admin-logout"
          onClick={() => {
            clearAdminToken();
            router.replace('/admin/login');
          }}
          type="button"
        >
          ⌕ &nbsp; Выход
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <nav>
            <Link href="/catalog">Каталог</Link>
            <Link href="/kovry">Ковры</Link>
            <Link href="/about">О нас</Link>
            <Link href="/contacts">Контакты</Link>
          </nav>
          <Link className="button button-red" href="/kovry/kovry-1">
            Записаться
          </Link>
        </header>
        <section className="admin-content">{children ?? <AdminBookings />}</section>
      </div>
    </div>
  );
}
