'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRehearsalPoints } from '@/hooks/use-rehearsal';

export function RehearsalPointsList() {
  const { data: points, isPending, isError } = useRehearsalPoints();

  if (isPending) return <p role="status">Загружаем репетиционные точки…</p>;
  if (isError) return <p role="alert">Не удалось загрузить список репетиционных точек.</p>;
  if (!points.length) return <p>Репетиционные точки пока не добавлены.</p>;

  return (
    <div className="points-grid">
      {points.map((point) => (
        <article className="point-card" key={point.id}>
          <div className="point-card-art">
            <div aria-hidden="true" className="rising-sun-half" />
            <Image
              alt="Репетиционное пространство"
              height={296}
              src="/design/illustrations/03-building.png"
              width={310}
            />
          </div>
          <div>
            <p className="eyebrow">Репетиционная точка</p>
            <h2>{point.name}</h2>
            <p>{point.address}</p>
            {point.description && <p>{point.description}</p>}
            <Link className="button button-red" href={`/kovry/${point.slug}`}>
              Подробнее <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
