

CREATE TABLE service (
	uuid not null unique default gen_random_uuid()
);

CREATE TABLE staff (
	id serial,
	uuid not null unique default gen_random_uuid(),
	email text not null unique
);

CREATE TABLE role (
	text not null unique
);

CREATE TABLE staff_role (
	staff integer not null references staff(id)
);