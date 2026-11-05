"use client";

import Image from "next/image";
import { useState } from "react";

const photos = [
  "/design/03-drum-kit.png",
  "/design/04-snare-drum.png",
  "/design/03-drum-kit.png",
  "/design/04-snare-drum.png",
];

export function ProductDetail({ slug }: { slug: string }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const name = slug === "tama-starclassic" ? "TAMA Starclassic" : slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const updatePhoto = (step: number) => setPhotoIndex((current) => (current + step + photos.length) % photos.length);

  return (
    <>
      <div className="breadcrumbs"><a href="/catalog">Каталог</a><span>/</span><span>{name}</span></div>
      <section className="product-detail">
        <div>
          <div className="gallery-main">
            <Image alt={`${name}, фотография ${photoIndex + 1}`} height={314} priority src={photos[photoIndex]} width={310} />
            <button aria-label="Предыдущее фото" className="gallery-arrow prev" onClick={() => updatePhoto(-1)} type="button">‹</button>
            <button aria-label="Следующее фото" className="gallery-arrow next" onClick={() => updatePhoto(1)} type="button">›</button>
          </div>
          <div aria-label="Фотографии товара" className="gallery-thumbs">
            {photos.map((photo, index) => <button aria-label={`Показать фото ${index + 1}`} aria-pressed={photoIndex === index} key={`${photo}-${index}`} onClick={() => setPhotoIndex(index)} type="button"><Image alt="" height={314} src={photo} width={310} /></button>)}
          </div>
        </div>

        <div className="product-info">
          <h1>{name}</h1>
          <p className="condition">Япония, б/у</p>
          <p className="detail-price">320 000 ₽</p>
          <span className="stock-badge"><span aria-hidden="true">●</span> В наличии</span>
          <a className="button button-red" href="/contacts">Связаться с продавцом <span aria-hidden="true">→</span></a>
          <h2 className="specs-title">Характеристики</h2>
          <dl className="specs"><div><dt>Размер</dt><dd>22″/10″/12″/16″</dd></div><div><dt>Материал</dt><dd>Клён</dd></div><div><dt>Отделка</dt><dd>Natural</dd></div></dl>
        </div>

        <div className="product-description"><h2>Описание</h2><p>Профессиональная ударная установка TAMA Starclassic. Отличное состояние, бережное использование. Комплектация: барабаны, стойки, педаль.</p><h2 className="similar-title">Похожие товары</h2><div className="similar-products">{["Pearl Masters", "Yamaha Recording", "Ludwig Classic"].map((item) => <a href="/catalog" key={item}><Image alt={item} height={120} src="/design/03-drum-kit.png" width={150} /><strong>{item}</strong></a>)}</div></div>
      </section>
    </>
  );
}
