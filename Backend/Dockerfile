# app/Dockerfile

#on alpine image
FROM python:3.9-alpine

#install nginx
RUN apk update && \
    apk add --no-cache nginx py3-pip && \
    mkdir -p /run/nginx

#install python/app dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

#copy the application
COPY . .

#copy Nginx conf to forward requests to Flask
COPY default.conf /etc/nginx/default.conf

#expose port 80 for nginx
EXPOSE 80

#run start shell script 
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]