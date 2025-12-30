FROM python:3.14-trixie
COPY requirements.txt .
RUN pip install -r requirements.txt && rm requirements.txt

COPY myapp /opt/myapp/myapp
WORKDIR  /opt/myapp

CMD gunicorn -b 0.0.0.0:5000 --access-logfile - "myapp:create_app()"

EXPOSE 5000

