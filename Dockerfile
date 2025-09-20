# Используем официальный Node.js образ
FROM node:20-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код проекта
COPY . .

# Компилируем Nest (если используешь TypeScript)
RUN npm run build

# Открываем порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "run", "start:prod"]
