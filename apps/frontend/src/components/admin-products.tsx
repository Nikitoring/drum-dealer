'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import {
  useAdminProduct,
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useDeleteProductImage,
  useUpdateProduct,
  useUploadProductImage,
  useUpdateProductImagePosition,
} from '@/hooks/use-admin-products';
import type { CreateProductInput, Product, ProductCondition, ProductStatus } from '@/types/api';

const emptyProduct: CreateProductInput = {
  name: '',
  slug: '',
  brand: '',
  category: '',
  price: '',
  condition: 'USED',
  status: 'AVAILABLE',
  description: '',
  specifications: {},
};

export function AdminProducts() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProductStatus | 'all'>('all');
  const productsQuery = useAdminProducts({ search, status: status === 'all' ? undefined : status });
  const deleteProduct = useDeleteProduct();
  const products = productsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1>Товары</h1>
        <Link className="button button-red" href="/admin/products/new">
          Добавить товар
        </Link>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <input
          aria-label="Поиск товаров"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск…"
          value={search}
        />
        <select
          aria-label="Статус товара"
          onChange={(event) => setStatus(event.target.value as ProductStatus | 'all')}
          value={status}
        >
          <option value="all">Все статусы</option>
          <option value="AVAILABLE">В наличии</option>
          <option value="SOLD">Продан</option>
          <option value="HIDDEN">Скрыт</option>
        </select>
      </div>
      {productsQuery.isPending ? <p role="status">Загружаем товары…</p> : null}
      {productsQuery.isError ? <p role="alert">{productsQuery.error.message}</p> : null}
      {!productsQuery.isPending && !products.length ? <p>Товары не найдены.</p> : null}
      {products.length > 0 && (
        <div className="booking-table-wrap mt-6">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Товар</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Статус</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product.id ?? product.slug}
                  product={product}
                  onDelete={() => deleteProduct.mutate(product.id!)}
                  deleting={deleteProduct.isPending}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {productsQuery.hasNextPage && (
        <button
          className="button button-outline-red mt-6"
          disabled={productsQuery.isFetchingNextPage}
          onClick={() => productsQuery.fetchNextPage()}
          type="button"
        >
          Загрузить ещё
        </button>
      )}
    </>
  );
}

function ProductRow({
  product,
  onDelete,
  deleting,
}: {
  product: Product;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <tr>
      <td>
        <strong>{product.name}</strong>
        <small>{product.brand || 'Без бренда'}</small>
      </td>
      <td>{product.category}</td>
      <td>{new Intl.NumberFormat('ru-RU').format(Number(product.price))} ₽</td>
      <td>
        <span className={`status-pill ${product.status.toLowerCase()}`}>
          {product.status === 'AVAILABLE'
            ? 'В наличии'
            : product.status === 'SOLD'
              ? 'Продан'
              : 'Скрыт'}
        </span>
      </td>
      <td>
        <div className="table-actions">
          <Link className="button button-outline-red" href={`/admin/products/${product.id}/edit`}>
            Изменить
          </Link>
          <button
            className="table-action reject"
            disabled={deleting}
            onClick={onDelete}
            type="button"
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AdminProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const productQuery = useAdminProduct(id ?? '');
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(id ?? '');
  const uploadImage = useUploadProductImage(id ?? '');
  const deleteImage = useDeleteProductImage(id ?? '');
  const updateImagePosition = useUpdateProductImagePosition(id ?? '');
  const product = productQuery.data;
  const [form, setForm] = useState<CreateProductInput>(emptyProduct);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && product && !initialized) {
      setForm({
        ...emptyProduct,
        ...product,
        brand: product.brand ?? '',
        description: product.description ?? '',
        specifications: product.specifications ?? {},
      });
      setInitialized(true);
    }
  }, [id, initialized, product]);

  if (id && productQuery.isPending) return <p role="status">Загружаем товар…</p>;
  if (id && productQuery.isError) return <p role="alert">{productQuery.error.message}</p>;

  const setField = <K extends keyof CreateProductInput>(key: K, value: CreateProductInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const mutation = id ? updateProduct : createProduct;
    mutation.mutate(form, {
      onSuccess: (saved) =>
        router.push(id ? '/admin/products' : `/admin/products/${saved.id}/edit`),
      onError: (reason) => setError(reason.message),
    });
  };

  return (
    <>
      <Link href="/admin/products">← Товары</Link>
      <h1 className="mt-8">{id ? 'Редактирование товара' : 'Новый товар'}</h1>
      <form className="mt-8 grid max-w-3xl gap-5" onSubmit={submit}>
        <label>
          Название
          <input
            required
            onChange={(event) => setField('name', event.target.value)}
            value={form.name}
          />
        </label>
        <label>
          Slug
          <input
            required
            onChange={(event) => setField('slug', event.target.value)}
            value={form.slug}
          />
        </label>
        <label>
          Бренд
          <input
            onChange={(event) => setField('brand', event.target.value)}
            value={form.brand ?? ''}
          />
        </label>
        <label>
          Категория
          <input
            required
            onChange={(event) => setField('category', event.target.value)}
            value={form.category}
          />
        </label>
        <label>
          Цена
          <input
            min="0"
            required
            onChange={(event) => setField('price', event.target.value)}
            type="number"
            value={form.price}
          />
        </label>
        <label>
          Состояние
          <select
            onChange={(event) => setField('condition', event.target.value as ProductCondition)}
            value={form.condition}
          >
            <option value="NEW">Новый</option>
            <option value="USED">Б/у</option>
          </select>
        </label>
        <label>
          Статус
          <select
            onChange={(event) => setField('status', event.target.value as ProductStatus)}
            value={form.status}
          >
            <option value="AVAILABLE">В наличии</option>
            <option value="SOLD">Продан</option>
            <option value="HIDDEN">Скрыт</option>
          </select>
        </label>
        <label>
          Описание
          <textarea
            onChange={(event) => setField('description', event.target.value)}
            rows={5}
            value={form.description ?? ''}
          />
        </label>
        <label>
          Характеристики (JSON)
          <textarea
            onChange={(event) => {
              try {
                setField('specifications', JSON.parse(event.target.value || '{}'));
              } catch {
                /* сохраняем предыдущее корректное значение */
              }
            }}
            rows={5}
            value={JSON.stringify(form.specifications ?? {}, null, 2)}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button
          className="button button-red"
          disabled={createProduct.isPending || updateProduct.isPending}
          type="submit"
        >
          {createProduct.isPending || updateProduct.isPending ? 'Сохраняем…' : 'Сохранить'}
        </button>
      </form>
      {id && product && (
        <ProductImages
          product={product}
          uploadImage={uploadImage}
          deleteImage={deleteImage}
          updateImagePosition={updateImagePosition}
        />
      )}
    </>
  );
}

function ProductImages({
  product,
  uploadImage,
  deleteImage,
  updateImagePosition,
}: {
  product: Product;
  uploadImage: ReturnType<typeof useUploadProductImage>;
  deleteImage: ReturnType<typeof useDeleteProductImage>;
  updateImagePosition: ReturnType<typeof useUpdateProductImagePosition>;
}) {
  return (
    <section className="mt-10 max-w-3xl">
      <h2>Изображения</h2>
      <input
        accept="image/png,image/jpeg,image/webp"
        disabled={uploadImage.isPending || product.images.length >= 10}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) uploadImage.mutate(file);
          event.currentTarget.value = '';
        }}
        type="file"
      />{' '}
      <div className="mt-4 flex flex-wrap gap-4">
        {product.images.map((image) => (
          <div key={image.id} className="relative">
            <img alt="" className="h-24 w-24 object-cover" src={image.url} />
            <input
              aria-label={`Позиция изображения ${(image.position ?? 0) + 1}`}
              className="w-16"
              defaultValue={image.position ?? 0}
              min="0"
              onBlur={(event) =>
                updateImagePosition.mutate({
                  imageId: image.id!,
                  position: Number(event.target.value),
                })
              }
              type="number"
            />
            <button
              aria-label="Удалить изображение"
              className="table-action reject"
              disabled={deleteImage.isPending}
              onClick={() => deleteImage.mutate(image.id!)}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
