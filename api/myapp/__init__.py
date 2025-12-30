from flask import Flask

def create_app():
    a = Flask (__name__)

    @a.get("/api/")
    def hello():
        return "Hello from Flask"
    return a