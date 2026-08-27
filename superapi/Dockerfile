FROM python:3-slim

RUN apt-get update
RUN apt-get install -y libpq5 curl vim

COPY requirements.txt .
RUN pip install --root-user-action ignore -r requirements.txt


WORKDIR /opt/superapi
COPY gunicorn.conf.py .
COPY superapi ./superapi

EXPOSE 5000

HEALTHCHECK --interval=1m --timeout=30s --start-period=30s --start-interval=1s --retries=3 CMD curl -f localhost:5000/healthcheck


ENTRYPOINT ["gunicorn", "--access-logfile", "-"]
CMD ["-b", "0.0.0.0:5000", "superapi:create_app()"]
