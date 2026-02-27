# IdeaTracker API Documentation

## Base URL
```
http://localhost:3000/api
```

## Аутентификация

### Регистрация
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Ответ:**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "reputation": 0,
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Вход
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Выход
```http
POST /auth/logout
Authorization: Bearer {accessToken}
```

### Обновить токен
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbG..."
}
```

---

## Пользователи

### Получить профиль
```http
GET /users/me
Authorization: Bearer {accessToken}
```

### Обновить профиль
```http
PATCH /users/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "Jane",
  "bio": "Разработчик",
  "skills": ["TypeScript", "React"]
}
```

### Получить профиль пользователя
```http
GET /users/:id
Authorization: Bearer {accessToken}
```

---

## Идеи

### Создать идею
```http
POST /ideas
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Новая социальная сеть",
  "description": "Описание идеи...",
  "presentationUrl": "https://docs.google.com/presentation/...",
  "tags": ["социальная сеть", "web"],
  "category": "сайт",
  "status": "published"
}
```

### Получить список идей
```http
GET /ideas?page=1&limit=10&status=published&category=сайт&sortBy=createdAt&sortOrder=DESC
```

**Ответ:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Новая социальная сеть",
      "description": "Описание...",
      "tags": ["социальная сеть", "web"],
      "category": "сайт",
      "status": "published",
      "viewsCount": 100,
      "averageRating": 4.5,
      "authorId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### Получить идею по ID
```http
GET /ideas/:id
```

### Обновить идею
```http
PATCH /ideas/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Обновленный заголовок",
  "description": "Обновленное описание..."
}
```

### Удалить идею
```http
DELETE /ideas/:id
Authorization: Bearer {accessToken}
```

### Получить мои идеи
```http
GET /ideas/my?page=1&limit=10
Authorization: Bearer {accessToken}
```

---

## Оценки

### Оценить идею
```http
POST /ideas/:ideaId/ratings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "interest": 5,
  "benefit": 4,
  "profitability": 3
}
```

### Получить мою оценку
```http
GET /ideas/:ideaId/ratings/my
Authorization: Bearer {accessToken}
```

### Обновить оценку
```http
PATCH /ideas/:ideaId/ratings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "interest": 4,
  "benefit": 5,
  "profitability": 4
}
```

### Получить все оценки идеи
```http
GET /ideas/:ideaId/ratings
```

---

## Комментарии

### Добавить комментарий
```http
POST /ideas/:ideaId/comments
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "Отличная идея!",
  "parentId": "uuid-comment" // опционально, для ответа
}
```

### Получить комментарии идеи
```http
GET /ideas/:ideaId/comments
```

### Обновить комментарий
```http
PATCH /ideas/:ideaId/comments/:commentId
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "Обновленный текст"
}
```

### Удалить комментарий
```http
DELETE /ideas/:ideaId/comments/:commentId
Authorization: Bearer {accessToken}
```

### Проголосовать за комментарий
```http
POST /ideas/:ideaId/comments/:commentId/vote
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "value": 1 // 1 = like, -1 = dislike
}
```

---

## Статусы идей

- `draft` — Черновик
- `published` — Опубликована
- `in_progress` — В работе
- `implemented` — Реализована
- `closed` — Закрыта

---

## Коды ошибок

| Код | Описание |
|-----|----------|
| 400 | Bad Request — неверные данные |
| 401 | Unauthorized — требуется аутентификация |
| 403 | Forbidden — нет прав доступа |
| 404 | Not Found — ресурс не найден |
| 409 | Conflict — конфликт данных (например, email занят) |
| 500 | Internal Server Error |

---

## Swagger UI

После запуска бэкенда документация Swagger доступна по адресу:
```
http://localhost:3000/api/docs
```
