# ─── Estágio 1: Build do React com Node ───────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia manifests de dependência primeiro (cache de camadas)
COPY package.json package-lock.json ./

RUN npm ci --silent

# Copia o restante do código e faz build de produção
COPY . .

RUN npm run build

# ─── Estágio 2: Nginx servindo o build + proxy reverso para o backend ─────────
FROM nginx:1.27-alpine AS runtime

# Remove configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa configuração customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos do build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
