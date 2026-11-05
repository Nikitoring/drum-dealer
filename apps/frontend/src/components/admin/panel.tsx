'use client';

import { CalendarCheck2, LayoutList, MonitorActivity, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DrmButton } from '@/components/ui';
import { clearAdminToken } from '@/lib/auth';

const menu = [
  { icon: MonitorActivity, label: 'Дашборд', href: '/admin/dashboard', id: 'dashboard' },
  { icon: LayoutList, label: 'Заявки', href: '/admin/bookings', id: 'bookings' },
  { icon: CalendarCheck2, label: 'Расписание', href: '/admin/schedule', id: 'schedule' },
  { icon: Package, label: 'Товары', href: '/admin/products', id: 'products' },
];

export function AdminPanel({
  active = 'bookings',
  children,
}: {
  active?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

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
          {menu.map(({ icon: Icon, ...item }) => (
            <Link
              aria-current={item.id === active ? 'page' : undefined}
              href={item.href}
              key={item.label}
            >
              <span className="admin-menu-icon">
                <Icon aria-hidden="true" size={20} />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <DrmButton
          className="admin-logout"
          onClick={() => {
            clearAdminToken();
            router.replace('/admin/login');
          }}
          type="button"
        >
          Выход
        </DrmButton>
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
        <section className="admin-content">{children}</section>
      </div>
    </div>
  );
}
