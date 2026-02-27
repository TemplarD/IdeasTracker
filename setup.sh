#!/bin/bash

# IdeaTracker Setup Script

echo "🚀 IdeaTracker - Настройка проекта"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cp .env.example .env
fi

# Install root dependencies
echo "📦 Установка корневых зависимостей..."
npm install

# Install backend dependencies
echo "📦 Установка зависимостей бэкенда..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Установка зависимостей фронтенда..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Установка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Проверьте настройки в файле .env"
echo "   2. Запустите: npm run dev"
echo "   3. Откройте http://localhost:3001"
echo ""
echo "📚 Документация:"
echo "   - Swagger API: http://localhost:3000/api/docs"
echo "   - README.md"
echo "   - docs/API.md"
