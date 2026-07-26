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

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl localhost:5000" ]

FROM base AS dev
RUN pip install pytest

FROM base AS prod
# Don't install pytest
