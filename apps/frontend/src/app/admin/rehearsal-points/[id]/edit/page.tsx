import { AdminPanel } from '@/components/admin';
import { AdminRehearsalPointForm } from '@/components/admin/rehearsal-point-form';

export default async function AdminRehearsalPointEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="admin-page">
      <AdminPanel active="schedule">
        <AdminRehearsalPointForm id={id} />
      </AdminPanel>
    </main>
  );
}
