import { AdminPanel, AdminSchedule } from '@/components/admin';

export default function AdminSchedulePage() {
  return (
    <main className="admin-page">
      <AdminPanel active="schedule">
        <AdminSchedule />
      </AdminPanel>
    </main>
  );
}
