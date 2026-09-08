FROM postgres:18.1

COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d/

ENV POSTGRES_DB=bookings-template
ENV POSTGRES_PASSWORD=Hello
ENV POSTGRES_USER=bookings


HEALTHCHECK --interval=1m --start-period=30s --start-interval=1s --timeout=2s CMD pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}
