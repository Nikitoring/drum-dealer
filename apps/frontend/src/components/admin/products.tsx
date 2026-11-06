'use client';

import { useState } from 'react';
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
} from '@/components/ui';
import { useAdminProducts, useDeleteProduct } from '@/hooks/use-admin-products';
import type { Product, ProductStatus } from '@/types/api';

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
