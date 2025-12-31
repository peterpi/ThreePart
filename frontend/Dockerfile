FROM nginx AS prod
RUN apt-get update && apt-get install -y vim curl
COPY default.conf /etc/nginx/conf.d/
EXPOSE 8000

COPY content /usr/share/nginx/bookings/

FROM prod AS dev