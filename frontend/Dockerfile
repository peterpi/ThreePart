FROM nginx
RUN apt-get update && apt-get install -y vim curl
COPY default.conf /etc/nginx/conf.d/
EXPOSE 8000