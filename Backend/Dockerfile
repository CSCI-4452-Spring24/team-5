# app/Dockerfile

#on alpine image
FROM python:3.9-alpine

#install pip and update
RUN apk add --no-cache py3-pip && \
    apk update

#install python/app dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

#copy the application
COPY . .

#expose port 80 for http connections
EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]