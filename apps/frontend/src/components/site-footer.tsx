import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link aria-label="На главную" className="footer-brand" href="/">
        <span className="brand-mark">×</span>
        <span>
          DRUM
          <br />
          DEALER
        </span>
        <span className="footer-divider" />
        <span>КОВРЫ</span>
      </Link>
      <nav aria-label="Навигация в подвале" className="footer-nav">
        <Link href="/catalog">Каталог</Link>
        <Link href="/kovry">Ковры</Link>
        <Link href="/about">О нас</Link>
        <Link href="/contacts">Контакты</Link>
      </nav>
      <div aria-label="Социальные сети" className="footer-social">
        <a href="https://t.me/" aria-label="Telegram">
          ➤
        </a>
        <a href="#" aria-label="ВКонтакте">
          ВК
        </a>
        <a href="#" aria-label="Видео">
          ▶
        </a>
      </div>
    </footer>
  );
}
