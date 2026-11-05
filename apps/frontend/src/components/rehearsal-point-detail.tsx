'use client';

import Image from 'next/image';
import { RehearsalBooking } from '@/components/rehearsal-booking';
import { useRehearsalPoint } from '@/hooks/use-rehearsal';

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
                ●
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
                  ☎
                </span>
                {point.contactPhone}
              </li>
            )}
            {point.equipment && (
              <li>
                <span className="detail-icon" aria-hidden="true">
                  ♫
                </span>
                {point.equipment}
              </li>
            )}
          </ul>
        </div>
        <div className="booking-hero-art">
          <Image
            alt="Репетиционная комната с музыкальным оборудованием"
            fill
            priority
            sizes="(max-width:640px) 100vw, 50vw"
            src="/design/05-rehearsal-building.png"
          />
        </div>
      </div>
      <RehearsalBooking pointId={point.id} pointSlug={point.slug} />
    </>
  );
}
