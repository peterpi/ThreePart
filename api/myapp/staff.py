

from flask import (Blueprint, abort, request)
from .auth import auth
from .db import get_db

bp = Blueprint ("staff", __name__)

@bp.get("")
@auth.login_required
def get_all():
	staff = []
	with get_db() as db:
		cur = db.execute ("SELECT * FROM staff")
		staff = list (map (lambda x : dict(x), cur))
	return {"staff":staff}



@bp.post("")
@auth.login_required
def new_staff():
	j = request.json
	name = j["name"]
	if not name or not name.strip():
		abort (404)
	email = j["email"]
	if not email or not email.strip():
		abort (404)
	with get_db() as db:
		cur = db.execute ("INSERT INTO staff (name, email) VALUES (%s,%s) RETURNING *", (name,email))
		s = cur.fetchone()
		return dict(s)

@bp.get("<uuid:uuid>")
@auth.login_required
def get_one(uuid):
	with get_db() as db:
		cur = db.execute ("SELECT uuid, name, email FROM staff WHERE uuid = %s", (str(uuid),))
		row = cur.fetchone()
		if not row :
			abort(404)
		return dict(row)




@bp.get("<uuid:staffUuid>/schedule")
@auth.login_required
def get_availability(staffUuid):
	staffUuid = str(staffUuid)
	with get_db() as db:
		# See if the staff member exists, otherwise return 404
		cur = db.execute ("SELECT id FROM staff WHERE uuid = %s", (staffUuid,))
		id = cur.fetchone()
		if not id:
			abort (404)
		cur = db.execute ("SELECT dow, starttime, duration FROM staff JOIN staffscheduledavailability on staff.id = staffscheduledavailability.staff JOIN scheduledavailability ON staffscheduledavailability.avail = scheduledavailability.id WHERE staff.id = %s", (id,))
		avails = list (map (lambda x: dict(x), cur))
		return {"scheduledavailability":avails}