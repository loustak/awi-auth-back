create table if not exists client
(
    client_id   bigint  not null
        constraint client_pk
            primary key,
    client_name varchar not null
);

create unique index if not exists client_client_id_uindex
    on client (client_id);

create table if not exists authorization_code
(
    code       varchar not null
        constraint authorization_code_pk
            primary key,
    firstname varchar,
    lastname  varchar,
    section    varchar,
    role       varchar
);

create unique index if not exists authorization_code_code_uindex
    on authorization_code (code);

create table if not exists token
(
    access_token  varchar not null
        constraint token_pk
            primary key,
    refresh_token varchar not null
);

create unique index if not exists token_access_token_uindex
    on token (access_token);

create unique index if not exists token_refresh_token_uindex
    on token (refresh_token);


INSERT INTO client (client_id, client_name) VALUES ('o2-g2', 'o2-g2 (enseignement)');
INSERT INTO client (client_id, client_name) VALUES ('o1-g3', 'o1-g3 (NOUS)');
INSERT INTO client (client_id, client_name) VALUES ('o1-g1', 'o1-g1 (recrutement)');
INSERT INTO client (client_id, client_name) VALUES ('o2-g1', 'o2-g1 (recrutement)');
INSERT INTO client (client_id, client_name) VALUES ('o1-g2', 'o1-g2 (enseignement)');
INSERT INTO client (client_id, client_name) VALUES ('prello', 'prello');
INSERT INTO client (client_id, client_name) VALUES ('network', 'reseau social');