from flask import Blueprint, abort, request

from .db import get_db
from .auth import auth
import psycopg.errors

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
	s = {"name" : row["servicename"], "uuid" : row["serviceuuid"]}
	return s

@bp.get("")
@auth.login_required
def get_all():
	with get_db() as db:
		offers = []
		offer = None
		# Get the offers and their services in one hit.
		cur = db.execute ("SELECT offer.id, offer.uuid, offer.name AS offername, duration, service.uuid AS serviceuuid, service.name AS servicename FROM offer LEFT OUTER JOIN offer_service ON offer.id = offer_service.offer JOIN service ON offer_service.sku = service.id")
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



@bp.post("/<uuid:offerUuid>/services")
@auth.login_required
def add_offer_service (offerUuid):
	offerUuid = str(offerUuid)
	j = request.json()
	serviceUuid = j["service"]
	with get_db() as db:
		try :
			cur = db.execute ("INSERT INTO offer_service (offer, sku) VALUES ( (SELECT id FROM offer WHERE uuid = %s), (SELECT id FROM service WHERE uuid = %s))", (offerUuid, serviceUuid))
			num = cur.rowcount
			if num == 0:
				abort (404)
		except psycopg.error.UniqueViolation as x:
			abort (409)
	return ({}, 204)

@bp.delete("/<uuid:offerUuid>/services/<uuid:serviceUuid>")
@auth.login_required
def delete_offer_service(offerUuid, serviceUuid):
	offerUuid = str(offerUuid)
	serviceUuid = str(serviceUuid)
	with get_db() as db:
		cur = db.execute ("DELETE FROM offer_service WHERE offer IN (SELECT id FROM offer WHERE uuid = %s) AND sku IN (SELECT id FROM service WHERE uuid = %s)", (offerUuid, serviceUuid))
		num = cur.rowcount
		if num == 0:
			abort (404)
	return ({}, 204)