# استخدم صورة Python الرسمية
FROM python:3.11-slim

# اضبط مجلد العمل داخل الـ container
WORKDIR /app

# انسخ كل ملفات المشروع
COPY . /app

# نزّل المكتبات المطلوبة
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r backend/requirements.txt

# عرّف الـ PORT (اللي Railway هيستخدمه)
ENV PORT=8000

# شغّل السيرفر
CMD ["bash", "-c", "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"]
