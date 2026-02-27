# IdeaTracker - Руководство по запуску

## Быстрый старт

### Вариант 1: Docker (рекомендуется)

```bash
# 1. Клонирование репозитория
cd /media/templard/4EAE65D6AE65B6DD2/projects/IdeasTraker

# 2. Копирование переменных окружения
cp .env.example .env

# 3. Запуск через Docker Compose
docker-compose up -d

# 4. Просмотр логов
docker-compose logs -f

# 5. Остановка
docker-compose down
```

**После запуска:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

### Вариант 2: Локальная разработка

#### Требования
- Node.js >= 18
- npm >= 9
- PostgreSQL >= 15
- Redis >= 7

#### Установка и запуск

```bash
# 1. Установка зависимостей
npm install

# 2. Установка зависимостей бэкенда
cd backend
npm install

# 3. Установка зависимостей фронтенда
cd ../frontend
npm install

# 4. Настройка переменных окружения
# Backend
cd ../backend
cp .env.example .env
# Отредактируйте .env при необходимости

# Frontend
cd ../frontend
cp .env.example .env

# 5. Запуск PostgreSQL и Redis
# Убедитесь, что службы запущены

# 6. Запуск бэкенда (терминал 1)
cd ../backend
npm run start:dev

# 7. Запуск фронтенда (терминал 2)
cd ../frontend
npm run start
```

---

## Тестирование

### Backend тесты

```bash
cd backend

# Unit тесты
npm run test

# Unit тесты с покрытием
npm run test:cov

# E2E тесты
npm run test:e2e

# E2E тесты с покрытием
npm run test:e2e:cov
```

### Frontend тесты

```bash
cd frontend

# Unit тесты
npm run test

# Unit тесты с покрытием
npm run test:cov

# E2E тесты (Playwright)
npm run test:e2e

# E2E тесты с UI
npm run test:e2e:ui
```

---

## Полезные команды

### Docker

```bash
# Перезапуск контейнеров
docker-compose restart

# Пересборка контейнеров
docker-compose up -d --build

# Остановка и удаление
docker-compose down -v

# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f frontend

# Вход в контейнер
docker exec -it ideatracker-backend sh
docker exec -it ideatracker-postgres psql -U ideatracker -d ideatracker
```

### База данных

```bash
# Подключение к PostgreSQL
docker exec -it ideatracker-postgres psql -U ideatracker -d ideatracker

# Просмотр таблиц
\dt

# Просмотр данных
SELECT * FROM users;
SELECT * FROM ideas;

# Выход
\q
```

### Redis

```bash
# Подключение к Redis
docker exec -it ideatracker-redis redis-cli -a ideatracker123

# Просмотр ключей
KEYS *

# Очистка
FLUSHALL

# Выход
EXIT
```

---

## Устранение проблем

### Ошибка: "Port already in use"

```bash
# Найти процесс на порту
lsof -i :3000
lsof -i :3001

# Убить процесс
kill -9 <PID>
```

### Ошибка: "Database connection failed"

```bash
# Проверить статус PostgreSQL
docker-compose ps postgres

# Перезапустить PostgreSQL
docker-compose restart postgres

# Проверить логи
docker-compose logs postgres
```

### Ошибка: "Cannot find module"

```bash
# Очистить кэш и переустановить
rm -rf node_modules package-lock.json
npm install
```

### Ошибка: "Build failed"

```bash
# Очистить build артефакты
cd backend && rm -rf dist
cd ../frontend && rm -rf dist

# Пересобрать
docker-compose up -d --build
```

---

## Структура проекта

```
IdeaTracker/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/        # Модули
│   │   │   ├── auth/       # Аутентификация
│   │   │   ├── users/      # Пользователи
│   │   │   ├── ideas/      # Идеи
│   │   │   ├── ratings/    # Оценки
│   │   │   └── comments/   # Комментарии
│   │   ├── database/       # Миграции
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/               # Тесты
│   └── package.json
│
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/    # Компоненты
│   │   ├── pages/         # Страницы
│   │   ├── services/      # API сервисы
│   │   ├── hooks/         # Хуки
│   │   ├── types/         # TypeScript типы
│   │   └── utils/         # Утилиты
│   ├── e2e/               # E2E тесты
│   └── package.json
│
├── docs/                   # Документация
│   └── API.md
│
├── docker-compose.yml      # Docker конфигурация
├── .github/workflows/      # CI/CD
└── README.md              # Основная документация
```

---

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `POST /api/auth/refresh` - Обновить токен

### Пользователи
- `GET /api/users/me` - Мой профиль
- `PATCH /api/users/me` - Обновить профиль
- `GET /api/users/:id` - Профиль пользователя

### Идеи
- `GET /api/ideas` - Список идей
- `GET /api/ideas/:id` - Детали идеи
- `POST /api/ideas` - Создать идею
- `PATCH /api/ideas/:id` - Обновить идею
- `DELETE /api/ideas/:id` - Удалить идею

### Оценки
- `POST /api/ideas/:ideaId/ratings` - Оценить
- `GET /api/ideas/:ideaId/ratings/my` - Моя оценка
- `PATCH /api/ideas/:ideaId/ratings` - Обновить оценку

### Комментарии
- `GET /api/ideas/:ideaId/comments` - Комментарии
- `POST /api/ideas/:ideaId/comments` - Добавить комментарий
- `DELETE /api/ideas/:ideaId/comments/:commentId` - Удалить

---

## Контакты и поддержка

- Документация: `/docs/API.md`
- Swagger UI: http://localhost:3000/api/docs
