
CREATE TABLE account (
	id uuid primary key default gen_random_uuid(),
	email text unique not null
);

CREATE TABLE installation (
	id uuid primary key default gen_random_uuid(),
	superuser UUID NOT NULL REFERENCES account(id)
);


CREATE TABLE org (
	id UUID PRIMARY KEY default gen_random_uuid(),
	orgname TEXT NOT NULL UNIQUE,
	dbHost TEXT NOT NULL,
	dbName TEXT NOT NULL
);

CREATE TABLE org_account_membership (
	org UUID NOT NULL REFERENCES org(id),
	account UUID NOT NULL REFERENCES account(id)
);
-- TODO combination of org+account must be unique.
