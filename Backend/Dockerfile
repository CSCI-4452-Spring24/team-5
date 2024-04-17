# app/Dockerfile

#on alpine image
FROM python:3.9-alpine

#install nginx
RUN apk add --no-cache py3-pip && \
    apk update

#install python/app dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

#copy the application
COPY . .

#expose port 80 for http connections
EXPOSE 80

CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]