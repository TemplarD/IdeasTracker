# IdeaTracker

Платформа для коллективной генерации, оценки и развития идей проектов.

[![CI/CD](https://github.com/yourusername/ideatracker/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/ideatracker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Описание

IdeaTracker позволяет пользователям:
- Публиковать идеи проектов
- Оценивать идеи по критериям (интерес, польза, прибыльность)
- Комментировать и обсуждать идеи
- Формировать команды для реализации
- Привлекать инвесторов

## 🚀 Быстрый старт

### Требования
- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 18 (для локальной разработки)

### Запуск через Docker

```bash
# Клонирование репозитория
git clone <repository-url>
cd IdeasTraker

# Копирование переменных окружения
cp .env.example .env

# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

После запуска:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/api/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Локальная разработка

```bash
# Установка зависимостей
./setup.sh  # Linux/Mac
# или
setup.bat   # Windows

# Запуск бэкенда (в терминале 1)
cd backend && npm run start:dev

# Запуск фронтенда (в терминале 2)
cd frontend && npm run start
```

📖 **Подробная инструкция:** [RUN.md](./RUN.md)

## 📁 Структура проекта

```
IdeaTracker/
├── backend/           # NestJS API
├── frontend/          # React приложение
├── shared/            # Общие типы и утилиты
├── docs/              # Документация
├── docker-compose.yml
└── README.md
```

## 🛠 Технологический стек

### Backend
- **Node.js** + **NestJS** - фреймворк
- **TypeScript** - типизация
- **PostgreSQL** - основная БД
- **Redis** - кэш и сессии
- **JWT** - аутентификация
- **Jest** - тестирование

### Frontend
- **React 18** + **TypeScript**
- **Bootstrap 5** + **Material Design**
- **React Query** - работа с API
- **React Router** - навигация
- **Playwright** - E2E тесты

## 📦 API Документация

После запуска бэкенда Swagger доступен по адресу:
http://localhost:3000/api/docs

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие
npm run test:coverage
```

## 📝 Этапы разработки

- [x] Этап 1: MVP (аутентификация, идеи, оценки, комментарии)
- [ ] Этап 2: Команды и прогресс
- [ ] Этап 3: Инвесторы и монетизация
- [ ] Этап 4: Мульти-тенантность
- [ ] Этап 5: Оптимизация и масштабирование

## 📄 Лицензия

MIT
