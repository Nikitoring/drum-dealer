import { AdminPanel } from '@/components/admin';
import { AdminRehearsalPointCreateForm } from '@/components/admin/rehersal-point-create-form';

export default async function AdminRehearsalPointCreatePage() {
  return (
    <main className="admin-page">
      <AdminPanel active="schedule">
        <AdminRehearsalPointCreateForm />
      </AdminPanel>
    </main>
  );
}
