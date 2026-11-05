import { AdminPanel, AdminProductForm } from '@/components/admin';

export default function NewProductPage() {
  return (
    <main className="admin-page">
      <AdminPanel active="products">
        <AdminProductForm />
      </AdminPanel>
    </main>
  );
}
