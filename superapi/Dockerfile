FROM python:3-slim

RUN apt-get update
RUN apt-get install -y libpq5

COPY requirements.txt .
RUN pip install --root-user-action ignore -r requirements.txt


WORKDIR /opt/superapi
COPY gunicorn.conf.py .
COPY superapi ./superapi


CMD ["gunicorn", "superapi:create_app()"]
