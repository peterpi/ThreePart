FROM postgres:18.1


ENV POSTGRES_DB=tenant-index
ENV POSTGRES_USER=superapi
ENV POSTGRES_PASSWORD=hello

COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d/

EXPOSE 5432

HEALTHCHECK --interval=30s --timeout=30s --start-period=20s --start-interval=1s --retries=3 CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB