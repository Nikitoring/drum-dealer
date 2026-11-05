import { AdminPanel } from '@/components/admin-bookings';
import { AdminSchedule } from '@/components/admin-schedule';

export default function AdminSchedulePage() {
  return (
    <main className="admin-page">
      <AdminPanel active="schedule">
        <AdminSchedule />
      </AdminPanel>
    </main>
  );
}
