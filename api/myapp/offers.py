from flask import Blueprint, abort, request

from .db import get_db
from .auth import auth

bp = Blueprint ("offers", __name__)



def offer_from_row (row):
	o = {
		"id": row["id"],
		"uuid": row["uuid"],
		"name" : row["offername"]
	}
	o["services"] = []
	return o

def service_from_row (row):
	s = {"name" : row["servicename"]}
	return s

@bp.get("")
@auth.login_required
def get_all():
	with get_db() as db:
		offers = []
		offer = None
		# Get the offers and their services in one hit.
		cur = db.execute ("SELECT offer.id, offer.uuid, offer.name AS offername, duration, service.name AS servicename FROM offer LEFT OUTER JOIN offer_service ON offer.id = offer_service.offer JOIN service ON offer_service.sku = service.id")
		while True :
			row = cur.fetchone()
			if not row:
				break
			nextOffer = (not offer) or (offer["id"] != row["id"])
			if nextOffer :
				offer = offer_from_row(row)
				offers.append(offer) # Even though we're still populating it, the code is neater if we add it now.
			service = service_from_row(row)
			if service:
				offer["services"].append(service)


	return {"offers": offers}

