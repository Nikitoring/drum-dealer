import { AdminPanel } from '@/components/admin-bookings';
import { AdminProducts } from '@/components/admin-products';

export default function AdminProductsPage() {
  return (
    <main className="admin-page">
      <AdminPanel active="products">
        <AdminProducts />
      </AdminPanel>
    </main>
  );
}
