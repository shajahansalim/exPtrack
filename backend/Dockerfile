FROM python:3.12-slim

# Setting up workspace

WORKDIR /app

# copying the files

COPY app .

COPY requirements.txt .
COPY requirements-dev.txt .

# installing the dependencies

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements-dev.txt

# exposing the port

EXPOSE 8000

# running the application

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]