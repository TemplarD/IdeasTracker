# Этап 2: Команды и прогресс - Документация

## Обзор

Модуль позволяет пользователям объединяться в команды для работы над идеями, отслеживать прогресс и управлять участниками.

## Сущности

### Team (Команда)
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | ID команды |
| name | string | Название команды |
| description | text | Описание |
| status | enum | Статус (active/completed/closed) |
| ideaId | uuid | ID связанной идеи |
| leaderId | uuid | ID лидера команды |
| createdAt | datetime | Дата создания |
| updatedAt | datetime | Дата обновления |

### TeamMember (Участник команды)
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | ID записи |
| teamId | uuid | ID команды |
| userId | uuid | ID пользователя |
| role | string | Роль в команде |
| bio | text | Информация об участнике |
| status | enum | Статус (pending/active/rejected/left) |
| joinedAt | datetime | Дата вступления |

### Progress (Прогресс)
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | ID записи |
| content | text | Содержание обновления |
| teamId | uuid | ID команды |
| authorId | uuid | ID автора |
| createdAt | datetime | Дата создания |

## API Endpoints

### Команды

#### Создать команду
```http
POST /api/teams
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Команда разработки",
  "description": "Описание команды",
  "ideaId": "uuid-идеи"
}
```

#### Получить команды идеи
```http
GET /api/teams/idea/:ideaId
```

#### Получить мои команды
```http
GET /api/teams/my
Authorization: Bearer {token}
```

#### Получить команду по ID
```http
GET /api/teams/:id
```

#### Обновить команду
```http
PATCH /api/teams/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Новое название",
  "status": "active"
}
```

#### Удалить команду
```http
DELETE /api/teams/:id
Authorization: Bearer {token}
```

### Участники команды

#### Подать заявку на вступление
```http
POST /api/teams/:teamId/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "Разработчик",
  "bio": "Опыт работы с React"
}
```

#### Получить участников
```http
GET /api/teams/:teamId/members
```

#### Получить активных участников
```http
GET /api/teams/:teamId/members/active
```

#### Обновить статус участника (лидер)
```http
PATCH /api/teams/:teamId/members/:memberId/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "active"
}
```

#### Покинуть команду
```http
DELETE /api/teams/:teamId/members/leave
Authorization: Bearer {token}
```

### Прогресс

#### Добавить запись о прогрессе
```http
POST /api/teams/:teamId/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Завершили разработку API"
}
```

#### Получить прогресс команды
```http
GET /api/teams/:teamId/progress
```

#### Удалить запись о прогрессе
```http
DELETE /api/teams/:teamId/progress/:progressId
Authorization: Bearer {token}
```

## Статусы

### TeamStatus
- `active` - Команда активна
- `completed` - Проект завершён
- `closed` - Команда закрыта

### MemberStatus
- `pending` - Заявка на рассмотрении
- `active` - Активный участник
- `rejected` - Заявка отклонена
- `left` - Покинул команду

## Бизнес-логика

1. **Создание команды**: Любой авторизованный пользователь может создать команду для идеи
2. **Вступление в команду**: Пользователь подаёт заявку со статусом `pending`
3. **Подтверждение участника**: Лидер команды меняет статус на `active`
4. **Прогресс**: Только активные участники могут видеть и добавлять записи о прогрессе
5. **Удаление команды**: Только лидер может удалить команду

## Тестирование

```bash
# Backend unit tests
cd backend
npm run test teams.service.spec
npm run test progress.service.spec

# E2E tests
npm run test:e2e
```

## Примеры использования

### Сценарий 1: Создание команды
1. Пользователь переходит на страницу идеи
2. Нажимает "Создать команду"
3. Заполняет название и описание
4. Команда создаётся, пользователь становится лидером

### Сценарий 2: Вступление в команду
1. Пользователь находит команду на странице идеи
2. Переходит на страницу команды
3. Нажимает "Вступить в команду"
4. Заявка отправляется лидеру
5. Лидер подтверждает заявку
6. Пользователь становится активным участником

### Сценарий 3: Добавление прогресса
1. Участник команды переходит на страницу команды
2. Вводит текст обновления в форму
3. Нажимает "Добавить"
4. Запись появляется в ленте прогресса
