create table dev_couples (
  id bigint not null primary key,
  user1_id text not null,
  user2_id text not null,
  created_at timestamp default now() not null
);

create table dev_monthly_invoices (
  id bigint not null primary key,
  created_at timestamp default now() not null,
  couple_id bigint references dev_couples (id),
  is_paid boolean not null,
  updated_at timestamp default now() not null
);

create table dev_payments (
  id bigint not null primary key,
  created_at timestamp default now() not null,
  updated_at timestamp default now() not null,
  monthly_invoice_id bigint references dev_monthly_invoices (id),
  amount bigint not null,
  name text not null
);

