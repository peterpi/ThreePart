FROM nginx AS base
RUN apt-get update && apt-get install -y vim curl
COPY content /usr/share/nginx/html

COPY content /usr/share/nginx/html/

FROM base as dev
COPY conf.d/dev/default.conf /etc/nginx/conf.d/
EXPOSE 80

FROM base AS prod
COPY conf.d/prod/default.conf /etc/nginx/conf.d/
EXPOSE 443