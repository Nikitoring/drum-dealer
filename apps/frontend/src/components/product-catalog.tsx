'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { DrmButton, DrmCheckbox, DrmInput, DrmSelect } from '@/components/ui';
import type { ProductCondition } from '@/types/api';
import { useCatalogFiltersStore } from '@/stores/product-store';
const rubles = new Intl.NumberFormat('ru-RU');

export function ProductCatalog() {
  const { search, condition, category, brand, sort, setFilter, reset } = useCatalogFiltersStore();
  const productsQuery = useProducts({
    brand: brand === 'all' ? undefined : brand,
    category: category === 'all' ? undefined : category,
    condition: condition === 'all' ? undefined : condition,
    search,
    sort,
  });
  const categoriesQuery = useCategories();
  const products = productsQuery.data?.pages.flatMap((result) => result.data) ?? [];

  return (
    <div className="catalog-content">
      <div className="catalog-layout">
        <aside aria-label="Фильтры каталога" className="catalog-filters">
          <h2>Категория</h2>
          {(categoriesQuery.data ?? []).map((item) => (
            <label key={item.id}>
              <DrmCheckbox
                checked={category === item.name}
                onChange={() => setFilter('category', category === item.name ? 'all' : item.name)}
              />{' '}
              {item.name}
            </label>
          ))}
          <h2>Бренд</h2>
          {['TAMA', 'Pearl', 'Yamaha', 'Ludwig'].map((item) => (
            <label key={item}>
              <DrmCheckbox
                checked={brand === item}
                onChange={() => setFilter('brand', brand === item ? 'all' : item)}
              />{' '}
              {item}
            </label>
          ))}
          <h2>Состояние</h2>
          {(['NEW', 'USED'] as ProductCondition[]).map((item) => (
            <label key={item}>
              <DrmCheckbox
                checked={condition === item}
                onChange={() => setFilter('condition', condition === item ? 'all' : item)}
              />{' '}
              {item === 'NEW' ? 'Новый' : 'Б/у'}
            </label>
          ))}
          <DrmButton className="filter-reset" onClick={reset} type="button">
            Сбросить
          </DrmButton>
        </aside>
        <div className="catalog-results">
          <div aria-label="Фильтры каталога" className="catalog-toolbar">
            <label className="sr-only" htmlFor="category-filter">
              Категория
            </label>
            <DrmSelect
              className="filter-control"
              id="category-filter"
              onChange={(event) => setFilter('category', event.target.value)}
              value={category}
            >
              <option value="all">Категория</option>
              {(categoriesQuery.data ?? []).map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </DrmSelect>
            <label className="sr-only" htmlFor="sort-filter">
              Сортировка
            </label>
            <DrmSelect
              className="filter-control"
              id="sort-filter"
              onChange={(event) => setFilter('sort', event.target.value)}
              value={sort}
            >
              <option value="default">Сначала новые</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="oldest">Сначала старые</option>
            </DrmSelect>
            <label className="search-control">
              <Search aria-hidden="true" size={18} strokeWidth={2} />
              <span className="sr-only">Поиск товаров</span>
              <DrmInput
                onChange={(event) => setFilter('search', event.target.value)}
                placeholder="Найти товар..."
                type="search"
                value={search}
              />
            </label>
          </div>
          {productsQuery.isError ? (
            <p role="alert">Не удалось загрузить товары. Попробуйте обновить страницу.</p>
          ) : products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <article className="product-card" key={product.slug}>
                    <Image
                      alt={product.name}
                      className="product-card-image"
                      height={314}
                      src={product.images[0]?.url || '/design/03-drum-kit.png'}
                      unoptimized
                      width={310}
                    />
                    <div className="product-card-body">
                      <h2>{product.name}</h2>
                      <p className="product-meta">
                        {[product.brand, product.condition === 'NEW' ? 'Новый' : 'Б/у']
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      <p className="product-price">{rubles.format(Number(product.price))} ₽</p>
                      <span className="stock-badge">
                        <span aria-hidden="true">●</span>{' '}
                        {product.status === 'SOLD' ? 'Продан' : 'В наличии'}
                      </span>
                      <Link className="button button-red" href={`/catalog/${product.slug}`}>
                        Подробнее <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              {productsQuery.hasNextPage && (
                <div className="pagination">
                  <DrmButton
                    className="button button-outline-red"
                    disabled={productsQuery.isFetchingNextPage}
                    onClick={() => productsQuery.fetchNextPage()}
                    type="button"
                  >
                    {productsQuery.isFetchingNextPage ? 'Загрузка…' : 'Загрузить ещё'}
                  </DrmButton>
                </div>
              )}
            </>
          ) : productsQuery.isPending ? (
            <p role="status">Загружаем товары…</p>
          ) : (
            <p role="status">Товары по запросу не найдены.</p>
          )}
        </div>
      </div>
    </div>
  );
}
