FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir fastapi uvicorn python-multipart soundfile numpy

# Copy server code
COPY server.py .

# XTTS model will be downloaded on first run
ENV COQUI_TOS_AGREED=1
ENV PORT=8100

EXPOSE 8100

CMD ["python", "server.py"]
