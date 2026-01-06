FROM python:3
CMD python upgrade.py

COPY requirements.txt /
RUN pip install -r requirements.txt

COPY upgrades /upgrades
COPY upgrade.py /
