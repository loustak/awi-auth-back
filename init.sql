CREATE TABLE client (
   client_id   NUMERIC       PRIMARY KEY,
   client_name    VARCHAR(1000)
);

CREATE TABLE authorization_code (
   authorization_code   VARCHAR(1000)       PRIMARY KEY,
   client_id    NUMERIC NOT NULL,
   "user_id"   NUMERIC NOT NULL REFERENCES user("user_id")
);

CREATE TABLE token (
   access_token   VARCHAR(1000)       PRIMARY KEY,
   refresh_token   VARCHAR(1000)                ,
   client_id    NUMERIC NOT NULL REFERENCES client("user_id")
);
CREATE TABLE user (
   "user_id" NUMERIC PRIMARY KEY,
   first_name VARCHAR(1000),
   last_name VARCHAR(1000),
   section   VARCHAR(1000),
   "role"    VARCHAR(1000)
)
