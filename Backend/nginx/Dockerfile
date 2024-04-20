#Backend/nginx/Dockerfile 
FROM nginx:latest

# Remove the existing default.conf
RUN rm /etc/nginx/conf.d/default.conf

# Add custom default.conf
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=5s --timeout=3s --retries=5 \
  CMD curl -f http://localhost/ || exit 1