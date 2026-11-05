import { AdminDashboard, AdminPanel } from '@/components/admin';

export default function AdminDashboardPage() {
  return (
    <main className="admin-page">
      <AdminPanel active="dashboard">
        <AdminDashboard />
      </AdminPanel>
    </main>
  );
}
