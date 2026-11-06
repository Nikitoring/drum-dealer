'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MapPin, SixteenthNotes, Phone } from 'lucide-react';
import { RehearsalBooking } from '@/components/rehearsal';
import { useRehearsalPoint } from '@/hooks/use-rehearsal';
import type { RehearsalPoint } from '@/types/api';

export function RehearsalPointDetail({ slug }: { slug: string }) {
  const { data: point, isPending, isError } = useRehearsalPoint(slug);

  if (isPending)
    return (
      <p className="page-surface" role="status">
        Загружаем репетиционную точку…
      </p>
    );
  if (isError || !point)
    return (
      <p className="page-surface" role="alert">
        Не удалось загрузить репетиционную точку.
      </p>
    );

  return (
    <>
      <div className="booking-hero">
        <div className="booking-hero-copy">
          <h1>{point.name}</h1>
          <p className="booking-lead">{point.description || 'Репетиционная точка'}</p>
          <ul className="point-details">
            <li>
              <span className="detail-icon" aria-hidden="true">
                <MapPin />
              </span>
              {point.address}
            </li>
            {point.pricePerHour && (
              <li>
                <span className="detail-icon" aria-hidden="true">
                  ₽
                </span>
                {new Intl.NumberFormat('ru-RU').format(Number(point.pricePerHour))} ₽ / час
              </li>
            )}
            {point.contactPhone && (
              <li>
                <span className="detail-icon" aria-hidden="true">
                  <Phone />
                </span>
                {point.contactPhone}
              </li>
            )}
            {point.equipment && (
              <li>
                <span className="detail-icon" aria-hidden="true">
                  <SixteenthNotes />
                </span>
                {point.equipment}
              </li>
            )}
          </ul>
        </div>
        <div className="booking-hero-art">
          <div aria-hidden="true" className="rising-sun-half" />
          <Image
            alt="Репетиционная комната с музыкальным оборудованием"
            fill
            priority
            sizes="(max-width:640px) 100vw, 50vw"
            src="/design/illustrations/03-building.png"
          />
        </div>
      </div>
      <PointGallery images={point.images ?? []} />
      <RehearsalBooking pointId={point.id} pointSlug={point.slug} />
    </>
  );
}

function PointGallery({ images }: { images: RehearsalPoint['images'] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  if (!images.length) return null;

  const activeImage = images[activeIndex];
  const move = (step: number) =>
    setActiveIndex((current) => (current + step + images.length) % images.length);

  return (
    <section className="point-gallery" aria-label="Фотографии репетиционной точки">
      <div className="point-gallery-heading">
        <h2>Фотографии</h2>
        <span>
          {activeIndex + 1} / {images.length}
        </span>
      </div>
      <div className="point-gallery-slider">
        <button
          aria-label="Предыдущее фото"
          className="point-gallery-arrow"
          onClick={() => move(-1)}
          type="button"
        >
          ‹
        </button>
        <button
          aria-label="Открыть фото на весь экран"
          className="point-gallery-main"
          onClick={() => setFullscreen(true)}
          type="button"
        >
          <Image
            alt="Фотография репетиционной точки"
            fill
            sizes="(max-width: 640px) 100vw, 700px"
            src={activeImage.url}
          />
        </button>
        <button
          aria-label="Следующее фото"
          className="point-gallery-arrow"
          onClick={() => move(1)}
          type="button"
        >
          ›
        </button>
      </div>
      <div className="point-gallery-thumbnails" aria-label="Выбор фотографии">
        {images.map((image, index) => (
          <button
            aria-label={`Показать фото ${index + 1}`}
            aria-pressed={activeIndex === index}
            className="point-gallery-thumbnail"
            key={image.id}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <Image alt="" fill sizes="100px" src={image.url} />
          </button>
        ))}
      </div>
      {fullscreen && (
        <div
          className="point-gallery-lightbox"
          role="dialog"
          aria-label="Полноэкранный просмотр фото"
        >
          <button
            aria-label="Закрыть полноэкранный просмотр"
            className="point-gallery-close"
            onClick={() => setFullscreen(false)}
            type="button"
          >
            ×
          </button>
          <button
            aria-label="Предыдущее фото"
            className="point-gallery-arrow"
            onClick={() => move(-1)}
            type="button"
          >
            ‹
          </button>
          <div className="point-gallery-fullscreen-image">
            <Image alt="Фотография репетиционной точки" fill sizes="100vw" src={activeImage.url} />
          </div>
          <button
            aria-label="Следующее фото"
            className="point-gallery-arrow"
            onClick={() => move(1)}
            type="button"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
