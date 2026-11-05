import { AdminPanel } from '@/components/admin-bookings';
import { AdminProductForm } from '@/components/admin-products';

export default function NewProductPage() {
  return (
    <main className="admin-page">
      <AdminPanel active="products">
        <AdminProductForm />
      </AdminPanel>
    </main>
  );
}
