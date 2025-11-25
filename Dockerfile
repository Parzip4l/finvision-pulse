# ==========================================
# STAGE 1: Build Frontend (React + Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# 1. Copy package.json dari ROOT project
COPY package.json package-lock.json* ./
# 2. Install dependencies (gabungan frontend & backend jika disatukan di root)
RUN npm install

# 3. Copy SEMUA file project (termasuk folder backend, src, public, dll)
COPY . .

# 4. Build Frontend
RUN npm run build

# ==========================================
# STAGE 2: Setup Backend (Node.js)
# ==========================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# 1. Copy package.json dari ROOT project
COPY package.json package-lock.json* ./
# 2. Install hanya dependencies production
RUN npm install --production

# 3. Copy file backend KHUSUS dari folder 'backend/' di host
#    ke folder saat ini (/app/backend) di container
COPY backend/server.js .
COPY backend/.env .

# ==========================================
# STAGE 3: Final Image (Nginx + Node.js + Supervisor)
# ==========================================
FROM node:20-alpine AS runner

# 1. Install Nginx & Supervisor
RUN apk add --no-cache nginx supervisor

# 2. Setup Frontend (Nginx)
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# Copy hasil build React dari Stage 1
COPY --from=frontend-builder /app/frontend/dist .

# 3. Setup Backend
WORKDIR /app/backend
# Copy hasil setup backend dari Stage 2
COPY --from=backend-builder /app/backend .

# 4. Copy Konfigurasi Nginx
#    Sesuai gambar, nginx.conf ada di dalam folder backend/nginx/
COPY backend/nginx/nginx.conf /etc/nginx/http.d/default.conf

# 5. Setup Supervisord
#    Membuat konfigurasi untuk menjalankan Backend & Nginx bersamaan
RUN echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "user=root" >> /etc/supervisord.conf && \
    # --- Config Backend ---
    echo "[program:backend]" >> /etc/supervisord.conf && \
    echo "command=node server.js" >> /etc/supervisord.conf && \
    echo "directory=/app/backend" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    # --- Config Nginx ---
    echo "[program:nginx]" >> /etc/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf

# 6. Expose Port Frontend
EXPOSE 9060

# 7. Jalankan Supervisor
CMD ["supervisord", "-c", "/etc/supervisord.conf"]