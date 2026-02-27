@echo off
REM IdeaTracker Setup Script for Windows

echo 🚀 IdeaTracker - Настройка проекта
echo ==================================

REM Check if .env exists
if not exist .env (
    echo 📝 Создание .env файла...
    copy .env.example .env
)

REM Install root dependencies
echo 📦 Установка корневых зависимостей...
call npm install

REM Install backend dependencies
echo 📦 Установка зависимостей бэкенда...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Установка зависимостей фронтенда...
cd frontend
call npm install
cd ..

echo.
echo ✅ Установка завершена!
echo.
echo 📋 Следующие шаги:
echo    1. Проверьте настройки в файле .env
echo    2. Запустите: npm run dev
echo    3. Откройте http://localhost:3001
echo.
echo 📚 Документация:
echo    - Swagger API: http://localhost:3000/api/docs
echo    - README.md
echo    - docs/API.md
