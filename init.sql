create table if not exists client
(
  client_id           varchar                                      not null
  constraint client_pk
  primary key,
  client_name         varchar                                      not null,
  client_display_name varchar default 'No name'::character varying not null,
  client_restriction  integer default 0                            not null,
  client_secret       varchar,
  client_hosts        varchar
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

create table if not exists token (
    access_token  varchar not null
        constraint token_pk
            primary key,
    refresh_token varchar not null
);

create unique index if not exists token_access_token_uindex
    on token (access_token);

create unique index if not exists token_refresh_token_uindex
    on token (refresh_token);


INSERT INTO client (client_id, client_name, client_display_name, client_restriction, client_secret, client_hosts) VALUES ('o2-g1', 'o2-g1 (recrutement)', '02 - G1 Recrutement', 2, 'secret-o2-g1', '0.0.0.0 127.0.0.1 localhost mydash.igpolytech.fr mydash-dev.igpolytech.fr');
INSERT INTO client (client_id, client_name, client_display_name, client_restriction, client_secret, client_hosts) VALUES ('o2-g2', 'o2-g2 (enseignement)', 'O2 - G2 Enseignement', 0, 'secret-o2-g2', '0.0.0.0 127.0.0.1 localhost mydash.igpolytech.fr mydash-dev.igpolytech.fr');
INSERT INTO client (client_id, client_name, client_display_name, client_restriction, client_secret, client_hosts) VALUES ('o1-g1', 'o1-g1 (recrutement)', 'O1 - G1 Recrutement', 2, 'secret-O1-g1', '0.0.0.0 127.0.0.1 localhost mydash.igpolytech.fr mydash-dev.igpolytech.fr');
INSERT INTO client (client_id, client_name, client_display_name, client_restriction, client_secret, client_hosts) VALUES ('o1-g2', 'o1-g2 (enseignement)', 'O1 - G2 Enseignement', 0, 'secret-o1-g2', '0.0.0.0 127.0.0.1 localhost mydash.igpolytech.fr mydash-dev.igpolytech.fr');
INSERT INTO client (client_id, client_name, client_display_name, client_restriction, client_secret, client_hosts) VALUES ('network', 'reseau social', 'Réseau social', 1, 'secret-network', '0.0.0.0 127.0.0.1 localhost mydash.igpolytech.fr mydash-dev.igpolytech.fr');
INSERT INTO client (client_id, client_name, client_display_name, client_restriction, client_secret, client_hosts) VALUES ('o1-g3', 'o1-g3 (NOUS)', 'O1 - G3 Dashboard', 0, 'secret-dashboard', '0.0.0.0 127.0.0.1 localhost mydash.igpolytech.fr mydash-dev.igpolytech.fr');
INSERT INTO client (client_id, client_name, client_display_name, client_restriction, client_secret, client_hosts) VALUES ('prello', 'prello', 'Prello', 0, 'secret-prello', '0.0.0.0 127.0.0.1 localhost mydash.igpolytech.fr mydash-dev.igpolytech.fr');
