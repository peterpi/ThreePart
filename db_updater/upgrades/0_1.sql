
CREATE TABLE booking_globals (
	ver INT NOT NULL
);

INSERT INTO booking_globals (ver) VALUES (1);


create table org (
	id UUID PRIMARY KEY,
	name TEXT NOT NULL
);


CREATE TABLE org_user (
	org UUID REFERENCES org(id),
	id text PRIMARY KEY
);


INSERT INTO org (id, name) VALUES ('65751c06-4e67-4c79-a2c5-8be031ed2fdb', 'Velvet Nails');

INSERT INTO org_user (org, id) VALUES ('65751c06-4e67-4c79-a2c5-8be031ed2fdb', 'peter.pimley@gmail.com');

