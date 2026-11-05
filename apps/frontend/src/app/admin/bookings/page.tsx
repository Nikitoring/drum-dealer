import { AdminBookings, AdminPanel } from '@/components/admin-bookings';

export default function AdminBookingsPage() {
  return (
    <main className="admin-page">
      <AdminPanel active="bookings">
        <AdminBookings />
      </AdminPanel>
    </main>
  );
}
