FROM python:3.14-trixie AS prod
COPY requirements.txt .
RUN pip install -r requirements.txt && rm requirements.txt

COPY myapp /opt/myapp/myapp
WORKDIR  /opt/myapp

ENTRYPOINT ["gunicorn", "--access-logfile", "-"]
CMD ["-b", "0.0.0.0:5000", "myapp:create_app()"]
EXPOSE 5000

FROM prod AS dev
RUN pip install pytest
RUN apt-get update && apt-get install -y curl vim
