# app/Dockerfile
FROM python:3.9-alpine

WORKDIR /app

COPY requirements.txt .

RUN apk add --no-cache python3 py3-pip
RUN pip3 install -r requirements.txt

COPY . .

CMD ["flask", "run", "--host=0.0.0.0"]
