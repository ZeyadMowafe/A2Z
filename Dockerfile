# ========================================
# Stage 1: Build Frontend (React)
# ========================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# نسخ package files
COPY frontend/package*.json ./

# تنزيل dependencies
RUN npm ci --only=production

# نسخ باقي ملفات الفرونت
COPY frontend/ ./

# بناء الفرونت للـ production
RUN npm run build

# ========================================
# Stage 2: Setup Backend + Serve Frontend
# ========================================
FROM python:3.11-slim

WORKDIR /app

# تنزيل dependencies الأساسية
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# نسخ ملفات المشروع
COPY backend/requirements.txt ./backend/
COPY backend/ ./backend/

# تنزيل Python packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt

# نسخ الفرونت المبني من الـ stage السابق
COPY --from=frontend-builder /app/frontend/build ./backend/build

# تعريف البورت
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Expose port
EXPOSE 8000

# تشغيل السيرفر
CMD ["sh", "-c", "cd backend && uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
