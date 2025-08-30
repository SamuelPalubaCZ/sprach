# Multi-stage build pro optimalizaci velikosti
FROM node:18-alpine AS builder

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování package souborů
COPY package*.json ./

# Instalace závislostí
RUN npm ci --only=production

# Kopírování zdrojových souborů
COPY . .

# Vytvoření produkční verze
FROM nginx:alpine

# Kopírování nginx konfigurace
COPY nginx.conf /etc/nginx/nginx.conf

# Kopírování aplikace z builder stage
COPY --from=builder /app /usr/share/nginx/html

# Vystavení portu
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Spuštění nginx
CMD ["nginx", "-g", "daemon off;"] 