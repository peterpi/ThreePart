

-- e.g. if a business has many locations
CREATE TABLE location (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid()
);

CREATE TABLE staff (
	id SERIAL PRIMARY KEY,
	uuid UUID NOT NULL UNIQUE default gen_random_uuid(),
	email text not null unique,
	name text not null unique
);

CREATE TABLE role (
	id SERIAL PRIMARY KEY,
	name text not null unique
);

CREATE TABLE staff_role (
	staff integer not null references staff(id) ON DELETE CASCADE,
	role INTEGER NOT NULL REFERENCES role(id) ON DELETE RESTRICT
);



-- e.g. "Manicure"
CREATE TABLE service (
	id SERIAL PRIMARY KEY,
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	name TEXT NOT NULL UNIQUE
);



-- e.g. "During December, Manicure and Pedicure for $60"
CREATE TABLE offer (
	id SERIAL PRIMARY KEY,
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	duration INTERVAL NOT NULL,
	price MONEY NOT NULL, -- This is the default; the caller can specify it per-sale in sale_line.
	startTime TIMESTAMP NOT NULL,
	endTime TIMESTAMP
);

-- lines for "Manicure" and "Pedicure" in the offer example above.
CREATE TABLE offer_service (
	offer INTEGER REFERENCES offer(id) ON DELETE CASCADE,
	sku INTEGER REFERENCES service(id) ON DELETE CASCADE,
	UNIQUE (offer, sku)
	-- TODO ordering.
);


CREATE TABLE cart (
	id SERIAL PRIMARY KEY,
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid()
);

CREATE TABLE cart_line (
	cart INTEGER NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
	offer INTEGER NOT NULL REFERENCES offer(id) ON DELETE RESTRICT
);

CREATE TABLE sale (
	id SERIAL PRIMARY KEY,
	uuid UUID NOT NULL default gen_random_uuid(),
	time TIMESTAMP NOT NULL DEFAULT 'now',
	cart INTEGER NOT NULL REFERENCES cart(id)
);

-- A specific, non-repeating period of availability.
-- e.g. 9am to 12am BST on 6th June 2012
CREATE TABLE availability (
	id serial primary key,
	uuid UUID not null UNIQUE default gen_random_uuid(),
	startTime time with time zone not null,
	endTime time with time zone not null
);

CREATE TABLE staffAvailability (
	staff integer not null references staff(id) on delete CASCADE,
	avail integer not null references availability(id) on delete CASCADE,
	unique (staff, avail)
);

-- A future availability period for anything (staff, equipment, etc.)
-- e.g. "Mondays from 9am until 12am"
CREATE TABLE scheduledAvailability (
	id serial primary key,
	dow INTEGER NOT NULL,
	startTime time without time zone NOT NULL,
	duration interval not NULL
	-- storing an interval rather than an endTime allows for e.g. "Mondays, 11pm for 4 hours"
);

CREATE TABLE staffScheduledAvailability (
	staff integer not null references staff(id) on delete CASCADE,
	avail integer not null references scheduledAvailability(id)
);

-- TODO Trigger deletion of scheduledAvailability 