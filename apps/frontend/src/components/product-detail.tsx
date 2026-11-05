'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DrmButton } from '@/components/ui';
import { useState } from 'react';
import { useProduct, useRelatedProducts } from '@/hooks/use-products';

export function ProductDetail({ slug }: { slug: string }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const { data: product, isPending, isError } = useProduct(slug);
  const { data: related } = useRelatedProducts(product?.category);

  if (isPending)
    return (
      <p className="page-surface" role="status">
        Загружаем товар…
      </p>
    );
  if (isError || !product)
    return (
      <p className="page-surface" role="alert">
        Не удалось загрузить товар.
      </p>
    );

  const photos = product.images.length
    ? product.images.map((image) => image.url)
    : ['/design/03-drum-kit.png'];
  const updatePhoto = (step: number) =>
    setPhotoIndex((current) => (current + step + photos.length) % photos.length);
  const relatedProducts = (related?.data ?? [])
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);
  const specs =
    product.specifications && typeof product.specifications === 'object'
      ? Object.entries(product.specifications)
      : [];

  return (
    <>
      <div className="breadcrumbs">
        <Link href="/catalog">Каталог</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <section className="product-detail">
        <div>
          <div className="gallery-main">
            <Image
              alt={`${product.name}, фотография ${photoIndex + 1}`}
              height={314}
              priority
              src={photos[photoIndex]}
              unoptimized
              width={310}
            />
            {photos.length > 1 && (
              <>
                <DrmButton
                  aria-label="Предыдущее фото"
                  className="gallery-arrow prev"
                  onClick={() => updatePhoto(-1)}
                  type="button"
                >
                  ‹
                </DrmButton>
                <DrmButton
                  aria-label="Следующее фото"
                  className="gallery-arrow next"
                  onClick={() => updatePhoto(1)}
                  type="button"
                >
                  ›
                </DrmButton>
              </>
            )}
          </div>
          {photos.length > 1 && (
            <div aria-label="Фотографии товара" className="gallery-thumbs">
              {photos.map((photo, index) => (
                <DrmButton
                  aria-label={`Показать фото ${index + 1}`}
                  aria-pressed={photoIndex === index}
                  key={`${photo}-${index}`}
                  onClick={() => setPhotoIndex(index)}
                  type="button"
                >
                  <Image alt="" height={314} src={photo} unoptimized width={310} />
                </DrmButton>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="condition">
            {product.brand ? `${product.brand} · ` : ''}
            {product.condition === 'NEW' ? 'Новый' : 'Б/у'}
          </p>
          <p className="detail-price">
            {new Intl.NumberFormat('ru-RU').format(Number(product.price))} ₽
          </p>
          <span className="stock-badge">
            <span aria-hidden="true">●</span> {product.status === 'SOLD' ? 'Продан' : 'В наличии'}
          </span>
          <Link className="button button-red" href="/contacts">
            Связаться с продавцом <span aria-hidden="true">→</span>
          </Link>
          {specs.length > 0 && (
            <>
              <h2 className="specs-title">Характеристики</h2>
              <dl className="specs">
                {specs.map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
        <div className="product-description">
          <h2>Описание</h2>
          <p>{product.description || 'Описание товара пока не добавлено.'}</p>
          {relatedProducts.length > 0 && (
            <>
              <h2 className="similar-title">Похожие товары</h2>
              <div className="similar-products">
                {relatedProducts.map((item) => (
                  <Link href={`/catalog/${item.slug}`} key={item.slug}>
                    <Image
                      alt={item.name}
                      height={120}
                      src={item.images[0]?.url || '/design/03-drum-kit.png'}
                      unoptimized
                      width={150}
                    />
                    <strong>{item.name}</strong>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
