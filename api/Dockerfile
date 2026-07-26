FROM python:3-slim AS prod

RUN apt-get update
RUN apt-get install -y curl vim 

COPY requirements.txt .
RUN pip install -r requirements.txt && rm requirements.txt

COPY myapp /opt/myapp/myapp
WORKDIR  /opt/myapp

ENTRYPOINT ["gunicorn", "--access-logfile", "-"]
CMD ["-b", "0.0.0.0:5000", "myapp:create_app()"]
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl localhost:5000" ]

FROM prod AS dev
RUN pip install pytest
