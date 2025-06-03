FROM node:20-alpine

WORKDIR /app

# Копируем package.json и tsconfig.json для установки зависимостей
COPY package*.json tsconfig.json ./

RUN npm install

# Копируем исходники
COPY . .

# Открываем порт для Vite Dev Server
EXPOSE 5173

# После сборки запускаем dev-сервер
CMD ["npm", "run", "dev"]
