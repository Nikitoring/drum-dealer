'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useProducts } from '@/hooks/use-products';
import type { ProductCondition } from '@/types/api';
const rubles = new Intl.NumberFormat('ru-RU');

export function ProductCatalog() {
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState<ProductCondition | 'all'>('all');
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [sort, setSort] = useState('default');
  const productsQuery = useProducts({
    brand: brand === 'all' ? undefined : brand,
    category: category === 'all' ? undefined : category,
    condition: condition === 'all' ? undefined : condition,
    search,
    sort,
  });
  const products = productsQuery.data?.pages.flatMap((result) => result.data) ?? [];

  const reset = () => {
    setCategory('all');
    setBrand('all');
    setCondition('all');
    setSearch('');
    setSort('default');
  };
  const updateFilter = (update: () => void) => {
    update();
  };

  return (
    <div className="catalog-content">
      <div className="catalog-layout">
        <aside aria-label="Фильтры каталога" className="catalog-filters">
          <h2>Категория</h2>
          {[
            'Акустические барабаны',
            'Электронные',
            'Малые барабаны',
            'Тарелки',
            'Стойки',
            'Аксессуары',
          ].map((item) => (
            <label key={item}>
              <input
                checked={category === item}
                onChange={() => updateFilter(() => setCategory(category === item ? 'all' : item))}
                type="checkbox"
              />{' '}
              {item}
            </label>
          ))}
          <h2>Бренд</h2>
          {['TAMA', 'Pearl', 'Yamaha', 'Ludwig'].map((item) => (
            <label key={item}>
              <input
                checked={brand === item}
                onChange={() => updateFilter(() => setBrand(brand === item ? 'all' : item))}
                type="checkbox"
              />{' '}
              {item}
            </label>
          ))}
          <h2>Состояние</h2>
          {(['NEW', 'USED'] as ProductCondition[]).map((item) => (
            <label key={item}>
              <input
                checked={condition === item}
                onChange={() => updateFilter(() => setCondition(condition === item ? 'all' : item))}
                type="checkbox"
              />{' '}
              {item === 'NEW' ? 'Новый' : 'Б/у'}
            </label>
          ))}
          <button className="filter-reset" onClick={reset} type="button">
            Сбросить
          </button>
        </aside>
        <div className="catalog-results">
          <div aria-label="Фильтры каталога" className="catalog-toolbar">
            <label className="sr-only" htmlFor="category-filter">
              Категория
            </label>
            <select
              className="filter-control"
              id="category-filter"
              onChange={(event) => updateFilter(() => setCategory(event.target.value))}
              value={category}
            >
              <option value="all">Категория⌄</option>
              <option value="Акустические барабаны">Акустические</option>
              <option value="Малые барабаны">Малые барабаны</option>
            </select>
            <label className="sr-only" htmlFor="sort-filter">
              Сортировка
            </label>
            <select
              className="filter-control"
              id="sort-filter"
              onChange={(event) => updateFilter(() => setSort(event.target.value))}
              value={sort}
            >
              <option value="default">Сначала новые</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="oldest">Сначала старые</option>
            </select>
            <label className="search-control">
              <span aria-hidden="true">⌕</span>
              <span className="sr-only">Поиск товаров</span>
              <input
                onChange={(event) => updateFilter(() => setSearch(event.target.value))}
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
                  <button
                    className="button button-outline-red"
                    disabled={productsQuery.isFetchingNextPage}
                    onClick={() => productsQuery.fetchNextPage()}
                    type="button"
                  >
                    {productsQuery.isFetchingNextPage ? 'Загрузка…' : 'Загрузить ещё'}
                  </button>
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
