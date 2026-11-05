export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <a href="/admin/products">← Товары</a>
      <h1 className="mt-8 text-4xl font-black uppercase">Редактирование товара</h1>
      <p className="mt-4">ID товара: {id}</p>
    </main>
  );
}
