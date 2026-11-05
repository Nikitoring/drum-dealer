import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const illustration = (name: string, svg = false) =>
  `/design/illustrations/${name}.${svg ? 'svg' : 'png'}`;

function FeatureIcon({ kind }: { kind: 'box' | 'calendar' | 'pin' }) {
  if (kind === 'box')
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48">
        <path d="m24 5 17 9.5v19L24 43 7 33.5v-19L24 5Z" />
        <path d="m7.5 14.5 16.5 10 16.5-10M24 25v18M15.5 10l17 10" />
      </svg>
    );
  if (kind === 'calendar')
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48">
        <rect x="7" y="10" width="34" height="32" rx="2" />
        <path d="M15 5v10M33 5v10M7 19h34M15 26h4m10 0h4m-18 8h4m10 0h4" />
      </svg>
    );
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48">
      <path d="M39 20c0 11-15 24-15 24S9 31 9 20a15 15 0 1 1 30 0Z" />
      <circle cx="24" cy="20" r="5" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="home-page">
      <SiteHeader />

      <div className="home-shell">
        <section aria-labelledby="drum-heading" className="constructivist-hero">
          <div className="constructivist-copy">
            <h1 className="tilted-title" id="drum-heading">
              Drum <br />
              Dealer
            </h1>
            <p className="hero-tagline">
              Барабаны
              <br />
              из Японии
            </p>
            <Link className="button button-red" href="/catalog">
              Перейти в каталог <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="drummer-art">
            <Image
              alt="Барабанщик с малым барабаном"
              fill
              priority
              sizes="(max-width: 700px) 100vw, 54vw"
              src={illustration('01-drummer', true)}
            />
          </div>
        </section>

        <section aria-labelledby="kovry-heading" className="kovry-feature">
          <div className="kovry-copy-home">
            <h2 className="tilted-title" id="kovry-heading">
              Ковры
            </h2>
            <p>
              Репетиционные точки
              <br />в центре города
            </p>
            <Link className="button button-dark" href="/kovry">
              Выбрать точку <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="kovry-room-art">
            <Image
              alt="Репетиционная комната с музыкальным оборудованием"
              fill
              sizes="(max-width: 700px) 100vw, 65vw"
              src="/design/kovry-room.jpg"
            />
          </div>
        </section>

        <section aria-label="Преимущества" className="home-benefits">
          <article>
            <FeatureIcon kind="box" />
            <h3>
              Инструменты
              <br />
              из Японии
            </h3>
          </article>
          <article>
            <FeatureIcon kind="calendar" />
            <h3>
              Удобная
              <br />
              запись
            </h3>
          </article>
          <article>
            <FeatureIcon kind="pin" />
            <h3>
              Две точки
              <br />в центре
            </h3>
          </article>
        </section>
        <div aria-hidden="true" className="home-red-ribbon" />

        <section aria-label="Наши направления" className="home-direction-cards">
          <article className="home-direction-card">
            <div>
              <h2>Drum Dealer</h2>
              <p>
                Барабаны, стойки, педали и аксессуары. Отборные инструменты из
                Японии для репетиций, студии и сцены.
              </p>
              <Link className="button button-outline-red" href="/catalog">
                В каталог <span aria-hidden="true">→</span>
              </Link>
            </div>
            <Image
              alt="Малый барабан"
              height={371}
              src={illustration('04-snare-drum')}
              width={489}
            />
          </article>
          <article className="home-direction-card">
            <div>
              <h2>Ковры</h2>
              <p>
                Уютные репетиционные точки с профессиональным оборудованием в
                центре города.
              </p>
              <Link className="button button-outline-red" href="/kovry">
                Выбрать точку <span aria-hidden="true">→</span>
              </Link>
            </div>
            <Image
              alt="Мегафон"
              height={400}
              src={illustration('06-megaphone')}
              width={506}
            />
          </article>
        </section>

        <section aria-label="Музыка объединяет" className="home-poster-bottom">
          <div className="poster-figure">
            <Image
              alt="Плакатный портрет женщины"
              height={416}
              src={illustration('02-man-and-woman')}
              width={479}
            />
          </div>
          <div className="poster-figure poster-building">
            <Image
              alt="Здание"
              height={426}
              src={illustration('03-building')}
              width={515}
            />
          </div>
          <p>
            Музыка
            <br />
            объединяет
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
