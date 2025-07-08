
FROM python:3.11

# var env
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    python3-dev \
    default-mysql-client \
    libffi-dev \
    libssl-dev \
    libjpeg-dev \
    libpng-dev \
    zlib1g-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libwebp-dev \
    tcl8.6-dev \
    tk8.6-dev \
    libharfbuzz-dev \
    libfribidi-dev \
    libxcb1-dev \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app

RUN pip install --upgrade pip

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# port django
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 