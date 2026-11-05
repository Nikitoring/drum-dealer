'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import {
  DrmButton,
  DrmInput,
  DrmSelect,
  DrmTable,
  DrmTableBody,
  DrmTableCell,
  DrmTableHead,
  DrmTableHeaderCell,
  DrmTableRow,
  DrmTextarea,
} from '@/components/ui';
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
        <DrmButton className="button-red" href="/admin/products/new">
          Добавить товар
        </DrmButton>
      </div>
      <div className="admin-product-filters mt-8">
        <label>
          Поиск товаров
          <DrmInput
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Название, бренд или категория"
            value={search}
          />
        </label>
        <label>
          Статус
          <DrmSelect
            onChange={(event) => setStatus(event.target.value as ProductStatus | 'all')}
            value={status}
          >
            <option value="all">Все статусы</option>
            <option value="AVAILABLE">В наличии</option>
            <option value="SOLD">Продан</option>
            <option value="HIDDEN">Скрыт</option>
          </DrmSelect>
        </label>
      </div>
      {productsQuery.isPending ? <p role="status">Загружаем товары…</p> : null}
      {productsQuery.isError ? <p role="alert">{productsQuery.error.message}</p> : null}
      {!productsQuery.isPending && !products.length ? <p>Товары не найдены.</p> : null}
      {products.length > 0 && (
        <div className="booking-table-wrap mt-6">
          <DrmTable className="booking-table">
            <DrmTableHead>
              <DrmTableRow>
                <DrmTableHeaderCell>Товар</DrmTableHeaderCell>
                <DrmTableHeaderCell>Категория</DrmTableHeaderCell>
                <DrmTableHeaderCell>Цена</DrmTableHeaderCell>
                <DrmTableHeaderCell>Статус</DrmTableHeaderCell>
                <DrmTableHeaderCell />
              </DrmTableRow>
            </DrmTableHead>
            <DrmTableBody>
              {products.map((product) => (
                <ProductRow
                  key={product.id ?? product.slug}
                  product={product}
                  onDelete={() => deleteProduct.mutate(product.id!)}
                  deleting={deleteProduct.isPending}
                />
              ))}
            </DrmTableBody>
          </DrmTable>
        </div>
      )}
      {productsQuery.hasNextPage && (
        <DrmButton
          className="button-outline-red mt-6"
          disabled={productsQuery.isFetchingNextPage}
          onClick={() => productsQuery.fetchNextPage()}
          type="button"
        >
          Загрузить ещё
        </DrmButton>
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
    <DrmTableRow>
      <DrmTableCell>
        <strong>{product.name}</strong>
        <small>{product.brand || 'Без бренда'}</small>
      </DrmTableCell>
      <DrmTableCell>{product.category}</DrmTableCell>
      <DrmTableCell>{new Intl.NumberFormat('ru-RU').format(Number(product.price))} ₽</DrmTableCell>
      <DrmTableCell>
        <span className={`status-pill ${product.status.toLowerCase()}`}>
          {product.status === 'AVAILABLE'
            ? 'В наличии'
            : product.status === 'SOLD'
              ? 'Продан'
              : 'Скрыт'}
        </span>
      </DrmTableCell>
      <DrmTableCell>
        <div className="table-actions">
          <DrmButton className="button-outline-red" href={`/admin/products/${product.id}/edit`}>
            Изменить
          </DrmButton>
          <DrmButton
            className="table-action reject"
            disabled={deleting}
            onClick={onDelete}
            aria-label={`Удалить товар «${product.name}»`}
            title="Удалить товар"
            type="button"
          >
            ×
          </DrmButton>
        </div>
      </DrmTableCell>
    </DrmTableRow>
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
      <form className="admin-product-form mt-8 grid max-w-3xl gap-5" onSubmit={submit}>
        <label>
          Название
          <DrmInput
            required
            onChange={(event) => setField('name', event.target.value)}
            value={form.name}
          />
        </label>
        <label>
          Slug
          <DrmInput
            required
            onChange={(event) => setField('slug', event.target.value)}
            value={form.slug}
          />
        </label>
        <label>
          Бренд
          <DrmInput
            onChange={(event) => setField('brand', event.target.value)}
            value={form.brand ?? ''}
          />
        </label>
        <label>
          Категория
          <DrmInput
            required
            onChange={(event) => setField('category', event.target.value)}
            value={form.category}
          />
        </label>
        <label>
          Цена
          <DrmInput
            min="0"
            required
            onChange={(event) => setField('price', event.target.value)}
            type="number"
            value={form.price}
          />
        </label>
        <label>
          Состояние
          <DrmSelect
            onChange={(event) => setField('condition', event.target.value as ProductCondition)}
            value={form.condition}
          >
            <option value="NEW">Новый</option>
            <option value="USED">Б/у</option>
          </DrmSelect>
        </label>
        <label>
          Статус
          <DrmSelect
            onChange={(event) => setField('status', event.target.value as ProductStatus)}
            value={form.status}
          >
            <option value="AVAILABLE">В наличии</option>
            <option value="SOLD">Продан</option>
            <option value="HIDDEN">Скрыт</option>
          </DrmSelect>
        </label>
        <label>
          Описание
          <DrmTextarea
            onChange={(event) => setField('description', event.target.value)}
            rows={5}
            value={form.description ?? ''}
          />
        </label>
        <label>
          Характеристики (JSON)
          <DrmTextarea
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
        {id && product && (
          <ProductImages
            product={product}
            uploadImage={uploadImage}
            deleteImage={deleteImage}
            updateImagePosition={updateImagePosition}
          />
        )}
        {error && <p role="alert">{error}</p>}
        <DrmButton
          className="button-red"
          disabled={createProduct.isPending || updateProduct.isPending}
          type="submit"
        >
          {createProduct.isPending || updateProduct.isPending ? 'Сохраняем…' : 'Сохранить'}
        </DrmButton>
      </form>
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
    <section className="product-images-field mt-4 max-w-3xl">
      <h2>Изображения</h2>
      <DrmInput
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
            <DrmInput
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
            <DrmButton
              aria-label="Удалить изображение"
              className="table-action reject"
              disabled={deleteImage.isPending}
              onClick={() => deleteImage.mutate(image.id!)}
              title="Удалить изображение"
              type="button"
            >
              ×
            </DrmButton>
          </div>
        ))}
      </div>
    </section>
  );
}
