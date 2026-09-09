

-- e.g. if a business has many locations
CREATE TABLE location (
	name TEXT NOT NULL UNIQUE,
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid()
);

CREATE TABLE staff (
	id SERIAL PRIMARY KEY,
	uuid UUID NOT NULL UNIQUE, -- no default, it comes from account(id) from the tenant index
	email text not null unique
);

CREATE TABLE role (
	name text not null unique
);

CREATE TABLE staff_role (
	staff integer not null references staff(id)
);



-- e.g. "Manicure"
CREATE TABLE service (
	id INTEGER PRIMARY KEY,
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	name TEXT NOT NULL UNIQUE
);



-- e.g. "During December, Manicure and Pedicure for $60"
CREATE TABLE offer (
	id INTEGER PRIMARY KEY,
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
);


CREATE TABLE cart (
	id INTERGER PRIMARY KEY,
	uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid()
);

CREATE TABLE cart_line (
	cart INTEGER NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
	offer INTEGER NOT NULL REFERENCES offer(id) ON DELETE RESTRICT
);

CREATE TABLE sale (
	id INTEGER PRIMARY KEY,
	uuid UUID NOT NULL default gen_random_uuid(),
	time TIMESTAMP NOT NULL DEFAULT 'now',
	cart INTEGER NOT NULL REFERENCES cart(id)
);
