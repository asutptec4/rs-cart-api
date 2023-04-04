create type cart_status as enum ('OPEN', 'ORDERED');

create extension if not exists "uuid-ossp";

create table carts (
	id uuid not null default uuid_generate_v4() primary key,
	user_id uuid not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    status cart_status default 'OPEN'
);

alter table carts
alter column created_at drop not null,
alter column updated_at drop not null;

alter table carts alter column updated_at drop default;

create table cart_items (
	id uuid not null default uuid_generate_v4() primary key,
	cart_id uuid not null references carts(id),
    product_id uuid not null,
    count integer not null
);

insert into carts (user_id, created_at, updated_at, status) values (uuid_generate_v4(), current_timestamp, current_timestamp, 'OPEN');

insert into cart_items (cart_id, product_id, count) values ('ba1ace99-fb36-481e-bc07-9f6be3d4ccea', '857c697e-ffe2-412d-b96c-bdd77073c717', 1);
insert into cart_items (cart_id, product_id, count) values ('ba1ace99-fb36-481e-bc07-9f6be3d4ccea', '18973adf-57ce-4063-8943-fe3773e8feb2', 2);
insert into cart_items (cart_id, product_id, count) values ('8c50c0a3-fbad-4f67-8745-073959fbf73b', '3b404321-0a19-4316-b76a-2b283bc7efa5', 1);

create type order_status as enum ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

create table orders (
	id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null references users(id),
    cart_id uuid not null references carts(id),
    payment json, 
    delivery json, 
    status order_status default 'OPEN',
    total float not null
);

drop table orders;

delete from orders;
delete from carts;
delete from cart_items;

create table users (
	id uuid not null default uuid_generate_v4() primary key,
	name text not null,
    email text,
    password text
);

