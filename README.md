# Drum Dealer & «Ковры»

Monorepo веб-проекта с двумя направлениями:

- **Drum Dealer** — каталог музыкальных инструментов и оборудования из Японии.
- **«Ковры»** — каталог репетиционных точек с расписанием и заявками на бронирование.

Проект находится в стадии MVP. Онлайн-оплата, корзина и личные кабинеты клиентов не входят в текущую реализацию.

## Что уже работает

- публичная главная страница, каталог товаров и страницы товаров;
- фильтрация товаров по категории, бренду и состоянию, поиск, сортировка и пагинация;
- категории товаров и изображения товаров;
- список и страницы репетиционных точек, изображения помещений и оборудования;
- просмотр временных слотов и отправка заявки с обязательным согласием на обработку персональных данных;
- административная авторизация по JWT;
- админ-панель товаров, расписания, заявок и репетиционных точек;
- PostgreSQL-схема Prisma и S3-compatible storage для изображений;
- Swagger UI на `/api/docs`.

## Стек

- **Frontend:** Next.js 15, React 19, TypeScript, TanStack Query, Zustand.
- **Backend:** NestJS 11, TypeScript, Prisma 6.
- **Данные:** PostgreSQL 16.
- **Файлы:** S3-compatible storage, в конфигурации предусмотрен Yandex Object Storage.
- **Инфраструктура:** Docker Compose для PostgreSQL.

## Структура

```text
apps/frontend/     Next.js-приложение и UI
apps/backend/      NestJS API, Prisma и миграции
docs/              требования, API, архитектурные решения и UI-компоненты
docker-compose.yml PostgreSQL для локальной разработки
```

## Запуск локально

Требования: Node.js `>=20.11`, npm и Docker.

```bash
cp .env.example .env
npm install
npm run db:up
npm run db:migrate
npm run db:generate
npm run dev
```

После запуска:

- frontend: `http://localhost:3000`;
- backend: `http://localhost:4000`;
- Swagger: `http://localhost:4000/api/docs`.

Для наполнения базы тестовыми данными:

```bash
npm run prisma:seed --workspace=@drum-dealer/backend
```

Переменные окружения описаны в .env.example.

## Команды

```bash
npm run dev           # PostgreSQL, frontend и backend
npm run build         # сборка workspaces
npm run dev:frontend  # только frontend
npm run dev:backend   # только backend
npm run db:up         # запустить PostgreSQL
npm run db:down       # остановить PostgreSQL
npm run db:migrate    # применить Prisma migrations
npm test --workspace=@drum-dealer/backend  # API-тесты backend
npm run test:watch --workspace=@drum-dealer/backend  # API-тесты в watch-режиме
```

Проверки frontend:

```bash
npm run check --workspace=@drum-dealer/frontend
```

API-тесты backend используют Jest, ts-jest и Supertest. Они поднимают Nest-приложение в памяти с моками Prisma и S3, поэтому для запуска не нужны PostgreSQL, Docker или реальные ключи Object Storage. Покрыты публичные и административные endpoint-ы, JWT-защита, валидация, POST/PATCH-сценарии, ошибки переходов статусов, бронирование и загрузка изображений.

## Документация

- [Актуальное ТЗ и границы MVP](./docs/requirements/README.md)
- [API](./docs/api/README.md)
- [UI-компоненты](./docs/ui/README.md)
- [Архитектурные решения](./docs/decisions/README.md)
