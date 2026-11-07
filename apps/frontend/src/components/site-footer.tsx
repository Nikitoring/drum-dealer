import Link from 'next/link';
import Image from 'next/image';
import { TelegramIcon } from './site/socialIcons/TelegramIcon';
import { VkIcon } from './site/socialIcons/VkIcon';
import { InstagramIcon } from './site/socialIcons/InstagramIcon';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link aria-label="На главную" className="footer-brand" href="/">
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
        <a href="https://t.me/drumsdealer" aria-label="Telegram">
          <TelegramIcon className="footer-social-icon"></TelegramIcon>
        </a>
        <a href="https://vk.ru/drumsdealer" aria-label="ВКонтакте">
          <VkIcon className="footer-social-icon"></VkIcon>
        </a>
        <a href="https://www.instagram.com/kovry_music" aria-label="Instagram">
          <InstagramIcon className="footer-social-icon"></InstagramIcon>
        </a>
      </div>
    </footer>
  );
}
