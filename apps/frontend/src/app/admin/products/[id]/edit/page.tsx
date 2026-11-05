import { AdminPanel } from '@/components/admin-bookings';
import { AdminProductForm } from '@/components/admin-products';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="admin-page">
      <AdminPanel active="products">
        <AdminProductForm id={id} />
      </AdminPanel>
    </main>
  );
}
