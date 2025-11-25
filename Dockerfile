# --- Stage 1: Build Frontend (React) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
# Copy package json frontend
COPY package.json package-lock.json* ./
RUN npm install
# Copy source code frontend
COPY . .
RUN npm run build
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
# Karena di prompt sebelumnya kode backend menyatu di root, kita copy file penting backend
COPY package.json package-lock.json* ./
RUN npm install --production
COPY server.js . 

COPY .env . 

# --- Stage 3: Final Image (Nginx + Node.js) ---
FROM node:20-alpine AS runner

# Install Nginx & Supervisord (untuk jalanin 2 proses)
RUN apk add --no-cache nginx supervisor

# Setup Nginx
WORKDIR /usr/share/nginx/html
# Hapus default nginx static file
RUN rm -rf ./*
# Copy hasil build frontend dari Stage 1
COPY --from=frontend-builder /app/frontend/dist .

# Setup Backend di Final Image
WORKDIR /app/backend
# Copy modules & code backend dari Stage 2
COPY --from=backend-builder /app/backend .

# Setup Konfigurasi Nginx
COPY nginx/nginx.conf /etc/nginx/http.d/default.conf

# Setup Supervisord Config
# Kita buat file konfigurasi on-the-fly atau copy jika ada
RUN echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "[program:backend]" >> /etc/supervisord.conf && \
    echo "command=node /app/backend/server.js" >> /etc/supervisord.conf && \
    echo "directory=/app/backend" >> /etc/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisord.conf

# Expose port (Frontend 9060, Backend 5000)
EXPOSE 9060 5000

# Jalankan Supervisord (yang akan menjalankan Nginx & Node.js)
CMD ["supervisord", "-c", "/etc/supervisord.conf"]