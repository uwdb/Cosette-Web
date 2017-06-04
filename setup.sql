create table users (user_id serial primary key, name varchar(30), email varchar(100), institution varchar(100), password varchar(100), api_key varchar(150));

create table queries (id serial primary key, username varchar(20), email varchar(100), timestamp bigint, cosette_code text, result varchar(10), institution varchar(100), coq_result varchar(10), rosette_result varchar(10), coq_log text, rosette_log text, error_msg text, counterexamples text, coq_source text, rosette_source text, api_key varchar(150));
