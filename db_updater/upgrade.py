import psycopg
import re
import os

a_b_form = re.compile(r"(\d+)_(\d+)\.sql")

topVersion = 0

for dirent in os.scandir ("upgrades"):
	if not dirent.is_file():
		continue
	name = dirent.name
	print (f"Considering {name}")
	match = a_b_form.fullmatch(name)
	assert (match)
	fromVersion = int(match.group(1))
	toVersion = int(match.group(2))
	topVersion = max (topVersion, toVersion)
	print (f"{name} goes from {fromVersion} to {toVersion}.")



print ("Hello world.")

db = psycopg.connect ("postgres://postgres@db/bookings-orgs", password = "Hello")

version = 0
try:
	version = int(db.execute("SELECT version FROM globals").fetchone()[0])
except Exception as x:
	pass # version stays at zero.


print (f"Database at version {version}, scripts up to version {topVersion}.")


