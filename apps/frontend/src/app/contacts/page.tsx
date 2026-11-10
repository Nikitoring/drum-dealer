import { TelegramIcon } from '@/components/site/socialIcons/TelegramIcon';
import { VkIcon } from '@/components/site/socialIcons/VkIcon';
import { InstagramIcon } from '@/components/site/socialIcons/InstagramIcon';

export default function ContactsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <a href="/">← Главная</a>
      <h1 className="mt-8 text-5xl font-black uppercase">Контакты</h1>
      <div className="mt-8 flex flex-col gap-4">
        <a
          href="https://t.me/drumsdealer"
          aria-label="Telegram"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <TelegramIcon style={{ maxWidth: '28px', maxHeight: '28px' }}></TelegramIcon>
          @drumsdealer
        </a>
        <a
          href="https://vk.ru/drumsdealer"
          aria-label="ВКонтакте"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <VkIcon style={{ maxWidth: '28px', maxHeight: '28px' }}></VkIcon>
          drumsdealer
        </a>
        <a
          href="https://www.instagram.com/kovry_music"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <InstagramIcon style={{ maxWidth: '28px', maxHeight: '28px' }}></InstagramIcon>
          @kovry_music
        </a>
      </div>
    </main>
  );
}
