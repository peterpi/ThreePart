
CREATE TABLE account (
	id uuid primary key default gen_random_uuid(),
	email text unique not null
);

CREATE TABLE installation (
	id uuid primary key default gen_random_uuid(),
	superuser UUID NOT NULL REFERENCES account(id)
);


CREATE TABLE dbHost (
	id SERIAL PRIMARY KEY,
	hostname TEXT NOT NULL UNIQUE,

	db TEXT NOT NULL,
	username TEXT NOT NULL,
	pass TEXT NOT NULL
);

-- Eventually this might be more complex.
INSERT INTO dbHost (hostname, db, username, pass) VALUES ('db', 'postgres', 'bookings', 'Hello');


CREATE TABLE org (
	id UUID PRIMARY KEY default gen_random_uuid(),
	orgname TEXT NOT NULL UNIQUE,
	dbHost INTEGER NOT NULL REFERENCES dbHost(id) ON DELETE RESTRICT,
	dbName TEXT NOT NULL
);

CREATE TABLE org_account_membership (
	org UUID NOT NULL REFERENCES org(id),
	account UUID NOT NULL REFERENCES account(id)
);
