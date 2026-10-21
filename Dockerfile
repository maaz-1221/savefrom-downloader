# Production Dockerfile for SaveFrom Video Downloader (Compatible with Hugging Face Spaces, Render, Koyeb)
FROM python:3.12-slim

# Install system dependencies including ffmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Set default port (7860 is required by Hugging Face Spaces, Render passes $PORT dynamically)
ENV PORT=7860
EXPOSE 7860

# Start application
CMD ["sh", "-c", "python -m uvicorn app:app --host 0.0.0.0 --port ${PORT:-7860}"]
