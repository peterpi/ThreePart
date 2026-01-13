FROM postgres:18.1

ENV POSTGRES_DB=bookings-orgs
ENV POSTGRES_PASSWORD=Hello
ENV POSTGRES_USER=bookings


HEALTHCHECK --interval=5s --start-period=30s --timeout=2s CMD pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}