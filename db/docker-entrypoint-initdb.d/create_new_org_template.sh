
createdb -U $POSTGRES_USER new_org_template

psql -U $POSTGRES_USER new_org_template << HERE


CREATE TABLE service (
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid()
);

CREATE TABLE staff (
	id SERIAL PRIMARY KEY,
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	email text not null unique
);

CREATE TABLE role (
	name text not null unique
);

CREATE TABLE staff_role (
	staff integer not null references staff(id)
);

HERE

