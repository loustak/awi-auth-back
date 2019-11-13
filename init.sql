CREATE TABLE client (
   client_id   NUMERIC       PRIMARY KEY,
   client_name    VARCHAR(1000) 
);

CREATE TABLE code (
   value_code   VARCHAR(1000)       PRIMARY KEY,
   client_id    NUMERIC NOT NULL,
   usr_id          VARCHAR(1000)            NOT NULL
);

CREATE TABLE token (
   value_token   VARCHAR(1000)       PRIMARY KEY,
   client_id    NUMERIC NOT NULL,
   usr_id          VARCHAR(1000)           NOT NULL
);

CREATE TABLE "user" (
   usr_id   VARCHAR(1000)       PRIMARY KEY,
   client_id    NUMERIC NOT NULL
);