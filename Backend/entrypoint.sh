#!/bin/sh

#start Nginx
nginx

#start Flask
flask run --host=0.0.0.0 --port=5000
