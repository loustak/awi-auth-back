CREATE TABLE client (
   client_id   NUMERIC       PRIMARY KEY,
   client_name    VARCHAR(1000)
);

CREATE TABLE code (
   value_code   VARCHAR(1000)       PRIMARY KEY,
   client_id    NUMERIC NOT NULL
);

CREATE TABLE token (
   value_token   VARCHAR(1000)       PRIMARY KEY,
   refresh_token   VARCHAR(1000)                ,
   client_id    NUMERIC NOT NULL
);

INSERT INTO client (client_id, client_name)
VALUES
   (2,'test');

INSERT INTO code (value_code, client_id)
VALUES
   ('codeTest',2);

 INSERT INTO token (value_token,refresh_token, client_id)
VALUES
   ('token','refreshToken',2);