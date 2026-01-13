import psycopg
import re
import os
import collections




print ("Hello world.")


a_b_form = re.compile(r"(\d+)_(\d+)\.sql")

topVersion = 0


Upgrade = collections.namedtuple ("Upgrade", "fromVersion, toVersion, script")

# For each "from" version, a list of upgrades from that version.
upgradesByFromVersion = {}

# Gather Upgrade instances
for dirent in os.scandir ("upgrades"):
	if not dirent.is_file():
		continue
	name = dirent.name
	print (f"Considering {name}")
	match = a_b_form.fullmatch(name)
	assert (match)
	fromVersion = int(match.group(1))
	toVersion = int(match.group(2))
	print (f"{name} goes from {fromVersion} to {toVersion}.")

	u = Upgrade (fromVersion, toVersion, name)
	
	allFromFromVersion = upgradesByFromVersion.get(fromVersion) or []
	allFromFromVersion.append(u)
	upgradesByFromVersion[fromVersion] = allFromFromVersion

	topVersion = max (topVersion, toVersion)




connect = lambda : psycopg.connect ("postgres://bookings@db/bookings-orgs", password = "Hello")

version = 0
try:
	with connect() as db:
		version = int(db.execute("SELECT ver FROM booking_globals").fetchone()[0])
except Exception as x:
	pass # version stays at zero.


print (f"Database at version {version}, scripts up to version {topVersion}.")

# TODO:  Figure out the entire route before starting to executy any scritps.

while True :

	if version == topVersion:
		break

	print (f"Trying to upgrade from version {version}")
	upgrades = upgradesByFromVersion.get(version)
	if not upgrades:
		raise Exception (f"Cannot proceed from version {version}.")
	
	print (f"From {version}: {upgrades} ")
	
	best = max (upgrades, key= lambda x : x.toVersion)
	print (f"Best script is {best.script} going from {best.fromVersion} => {best.toVersion}.")
	filename = f"upgrades/{best.script}"
	with open(filename, "r") as file:
		with connect() as db:
			db.execute (file.read())
	version = best.toVersion

