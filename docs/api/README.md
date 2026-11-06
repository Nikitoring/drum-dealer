# API

REST API backend проекта. Все маршруты имеют префикс `/api`. Swagger UI доступен по адресу `http://localhost:4000/api/docs`.

## Общие правила

- JSON используется для обычных запросов и ответов; загрузка изображений — `multipart/form-data`.
- Идентификаторы — UUID.
- Даты передаются в RFC 3339 с часовым поясом.
- Денежные значения возвращаются десятичными строками в RUB.
- Админские маршруты требуют `Authorization: Bearer <JWT>`.
- Глобальная валидация отклоняет неизвестные поля (`whitelist`) и преобразует типы.
- Списки товаров и заявок используют `page` и `pageSize` (по умолчанию 20, максимум 100).

Формат пагинированного ответа:

```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 20, "total": 0, "totalPages": 0 }
}
```

Ошибки имеют поля `statusCode`, `code` и `message`. Частые коды: `SLOT_UNAVAILABLE`, `INVALID_STATUS_TRANSITION`, `SLUG_EXISTS`, `CATEGORY_NOT_FOUND`, `IMAGE_LIMIT_REACHED`.

## Реализованные публичные маршруты

| Метод | Маршрут | Назначение |
| --- | --- | --- |
| `GET` | `/api/health` | Проверка доступности API: `{ "status": "ok" }` |
| `GET` | `/api/categories` | Список категорий товаров |
| `GET` | `/api/products` | Публичный каталог с фильтрами и пагинацией |
| `GET` | `/api/products/:slug` | Товар по slug; скрытые товары дают `404` |
| `GET` | `/api/rehearsal-points` | Список репетиционных точек |
| `GET` | `/api/rehearsal-points/:slug` | Репетиционная точка по slug |
| `GET` | `/api/rehearsal-points/:slug/slots` | Слоты точки за период |
| `POST` | `/api/bookings` | Создание заявки на свободный слот |

### `GET /api/products`

Query-параметры: `page`, `pageSize`, `category` (название категории), `brand`, `condition` (`NEW`/`USED`), `q`, `sort` (`price_asc`, `price_desc`, `newest`, `oldest`). Публичный ответ не включает `HIDDEN`; `SOLD` остаются видимыми.

### `GET /api/rehearsal-points/:slug/slots`

Query-параметры `from` и `to` ограничивают диапазон `[from, to)`. Возвращаются `id`, `startAt`, `endAt`, `status`. Данные клиентов публично не возвращаются.

### `POST /api/bookings`

```json
{
  "timeSlotId": "uuid",
  "customerName": "Иван",
  "customerPhone": "+79990000000",
  "customerEmail": "ivan@example.com",
  "comment": "Нужен микрофон",
  "personalDataConsent": true
}
```

Обязательны `timeSlotId`, `customerName`, `customerPhone` и `personalDataConsent: true`. Honeypot-поле `website` при заполнении отклоняет запрос. При гонке за слот сервер атомарно переводит только один `AVAILABLE`-слот в `PENDING`, второй запрос получает `409 SLOT_UNAVAILABLE`.

## Авторизация и админские маршруты

| Метод | Маршрут | Авторизация | Назначение |
| --- | --- | --- | --- |
| `POST` | `/api/admin/auth/login` | нет | Вход по email и паролю |
| `GET` | `/api/admin/auth/me` | JWT | Проверка токена |
| `GET` | `/api/admin/dashboard` | JWT | Счётчики и последние заявки |
| `GET` | `/api/admin/products` | JWT | Все товары, включая скрытые |
| `POST` | `/api/admin/products` | JWT | Создание товара |
| `GET` | `/api/admin/products/:id` | JWT | Товар для редактирования |
| `PATCH` | `/api/admin/products/:id` | JWT | Обновление товара |
| `DELETE` | `/api/admin/products/:id` | JWT | Удаление товара и его изображений |
| `POST` | `/api/admin/products/:id/images` | JWT | Загрузка изображения товара |
| `PATCH` | `/api/admin/products/:id/images/:imageId` | JWT | Изменение позиции изображения |
| `DELETE` | `/api/admin/products/:id/images/:imageId` | JWT | Удаление изображения |
| `POST` | `/api/admin/categories` | JWT | Создание категории |
| `GET` | `/api/admin/rehearsal-points` | JWT | Список точек |
| `GET` | `/api/admin/rehearsal-points/:id` | JWT | Точка для редактирования |
| `POST` | `/api/admin/rehearsal-points` | JWT | Создание точки |
| `PATCH` | `/api/admin/rehearsal-points/:id` | JWT | Обновление точки |
| `DELETE` | `/api/admin/rehearsal-points/:id` | JWT | Удаление точки без связанных слотов |
| `POST` | `/api/admin/rehearsal-points/:id/time-slots` | JWT | Создание часового слота |
| `POST` | `/api/admin/rehearsal-points/:id/images` | JWT | Загрузка изображения точки |
| `DELETE` | `/api/admin/rehearsal-points/:id/images/:imageId` | JWT | Удаление изображения точки |
| `GET` | `/api/admin/time-slots` | JWT | Слоты с заявками по фильтрам |
| `PATCH` | `/api/admin/time-slots/:id/status` | JWT | Переключение `AVAILABLE`/`BLOCKED` |
| `GET` | `/api/admin/bookings` | JWT | Пагинированный список заявок |
| `GET` | `/api/admin/bookings/:id` | JWT | Детали заявки |
| `PATCH` | `/api/admin/bookings/:id/status` | JWT | Изменение статуса заявки |
| `GET` | `/api/admin/schedule` | JWT | Legacy-сводка расписания по точкам |
| `POST` | `/api/admin/schedule/slots` | JWT | Legacy-создание слота |
| `PATCH` | `/api/admin/schedule/slots/:id/status` | JWT | Legacy-изменение статуса слота |

## Статусы

| Сущность | Поле | Значения |
| --- | --- | --- |
| `Product` | `condition` | `NEW`, `USED` |
| `Product` | `status` | `AVAILABLE`, `SOLD`, `HIDDEN` |
| `TimeSlot` | `status` | `AVAILABLE`, `PENDING`, `BOOKED`, `BLOCKED` |
| `RehearsalBooking` | `status` | `PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED` |
| `RehearsalPointImage` | `type` | `POINT`, `EQUIPMENT` |

Допустимые переходы заявок:

| Текущий статус | Новый статус | Слот |
| --- | --- | --- |
| `PENDING` | `CONFIRMED` | `BOOKED` |
| `PENDING` | `REJECTED` | `AVAILABLE` |
| `CONFIRMED` | `CANCELLED` | `AVAILABLE` |

## Изображения

Изображения принимаются в PNG, JPEG или WebP. Фактический тип файла проверяется сервером. Лимит размера задаётся `MAX_IMAGE_SIZE_BYTES` и по умолчанию равен 5 MiB. Для одного товара и для каждого типа изображения репетиционной точки разрешено до 10 файлов. Бинарные данные отправляются в S3-compatible storage, в базе сохраняются URL и метаданные.

