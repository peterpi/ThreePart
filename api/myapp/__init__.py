from flask import (Flask, request)

from werkzeug.middleware.proxy_fix import ProxyFix


def create_app():
    a = Flask (__name__)


    a.wsgi_app = ProxyFix(
        a.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
    )

    @a.get("/api/")
    def hello():
        return f"Hello from Flask.  You are {request.remote_addr}."
    return a