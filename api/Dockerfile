FROM python:3-slim AS base

RUN apt-get update

# Postgres client library.
RUN apt-get install -y libpq5

# Useful enough to justify always including them.
RUN apt-get install -y curl vim 

COPY requirements.txt .
RUN pip install -r requirements.txt && rm requirements.txt

COPY myapp /opt/myapp/myapp
WORKDIR  /opt/myapp

ENTRYPOINT ["gunicorn", "--access-logfile", "-"]
CMD ["-b", "0.0.0.0:5000", "myapp:create_app()"]
EXPOSE 5000

HEALTHCHECK --interval=1m --timeout=30s --start-period=30s --start-interval=1s --retries=3 CMD curl -f localhost:5000/hello

FROM base AS dev
RUN pip install pytest

FROM base AS prod
# Don't install pytest
