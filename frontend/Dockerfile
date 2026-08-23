FROM nginx AS base
RUN apt-get update && apt-get install -y vim curl

COPY content /usr/share/nginx/html
COPY content_tenant_admin /opt/tenant_admin/html


# Regular frontend is on port 81.  Tenant admin is on 81
FROM base as dev
COPY conf.d/dev /etc/nginx/templates
EXPOSE 80 81

# Regular frontend and tenant admin are virtualhosts both on 443.
FROM base AS prod
COPY conf.d/prod /etc/nginx/templates/
EXPOSE 443