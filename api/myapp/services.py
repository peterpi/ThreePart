
from flask import Blueprint, request, abort, jsonify
from .auth import auth
from .db import get_db, get_session
import psycopg


from .base import Base
from uuid import UUID

from sqlalchemy import Uuid, select
from sqlalchemy.orm import Mapped, mapped_column

bp = Blueprint("services", __name__)


class Service(Base):
	__tablename__ = "service"
	uuid: Mapped[UUID] = mapped_column(Uuid, primary_key=True)
	name: Mapped[str] = mapped_column()


@bp.get("")
@auth.login_required
def get_all():
	with get_session() as session:
		get = select(Service)
		rows = session.scalars(get).all()
		return {"services" : rows}

@bp.get("<uuid:uuid>")
@auth.login_required
def get_one(uuid):
	with get_session() as session:
		row = session.scalar(select(Service).where(Service.uuid == uuid))
		if not row:
			abort (404)
		return jsonify(row)

@bp.post("")
@auth.login_required
def post_new():
	j = request.json
	name = j["name"] or abort (400)
	with get_db() as db:
		try:
			cur = db.execute ("INSERT INTO service (name) VALUES (%s) RETURNING name, uuid", (name,))
			row = cur.fetchone()
			return dict(row)
		except psycopg.errors.UniqueViolation as dupe:
			abort (409)
		except Exception as x:
			abort (400) # Blame the user :p

@bp.put("<uuid:uuid>")
@auth.login_required
def put_existing(uuid):
	j = request.json
	name = j["name"] or abort (400)
	with get_db() as db:
		cur = db.execute ("UPDATE service SET name = %s WHERE uuid = %s RETURNING name,uuid", (name, uuid))
		row = cur.fetchone()
		if not row:
			abort (404)
		return row

@bp.delete("<uuid:uuid>")
@auth.login_required
def delete (uuid):
	uuid = str(uuid)
	with get_db() as db:
		db.execute ("DELETE FROM service WHERE uuid = %s", (uuid,))
	return ({}, 204)