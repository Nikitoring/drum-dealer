import { AdminPanel, AdminProducts } from '@/components/admin';

export default function AdminProductsPage() {
  return (
    <main className="admin-page">
      <AdminPanel active="products">
        <AdminProducts />
      </AdminPanel>
    </main>
  );
}
