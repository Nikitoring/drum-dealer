import Image from 'next/image';
import Link from 'next/link';

const links = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/kovry', label: 'Ковры' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
];

export function SiteHeader() {
  return (
    <header className="site-frame site-header">
      <Link aria-label="Drum Dealer и Ковры — главная" className="brand-lockup" href="/">
        <span className="brand-drum">
          <Image
            src="/logo.png"
            alt="logo"
            priority
            height={80}
            width={80}
            sizes="80px"
            quality={80}
          />
          <span>
            DRUM
            <br />
            DEALER
          </span>
        </span>
        <span className="brand-divider" aria-hidden="true" />
        <span className="brand-kovry">КОВРЫ</span>
      </Link>

      <nav aria-label="Основная навигация" className="site-nav">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <Link className="button button-red header-cta" href="/kovry">
        Записаться
      </Link>
    </header>
  );
}
