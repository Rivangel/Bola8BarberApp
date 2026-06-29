# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────
# App de administración (Expo / React Native) — Bola 8 Barbería
# Sirve la versión WEB de la app mediante el servidor de desarrollo de Expo.
# (El desarrollo en dispositivo físico se sigue haciendo con Expo en el host).
# ─────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=development
ENV EXPO_NO_TELEMETRY=1

# URL de la API que usará la app web (se ejecuta en el navegador del host, por
# eso apunta a localhost, donde Docker publica el puerto de la API).
ARG EXPO_PUBLIC_API_URL=http://localhost:3000
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

# Instalar dependencias.
COPY package*.json ./
RUN npm ci

# Copiar el resto del código.
COPY . .

# Puerto del servidor web/Metro de Expo.
EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--port", "8081"]
