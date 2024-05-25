create table dev_couples (
  id bigint not null primary key,
  user1_id bigint not null,
  user2_id bigint not null,
  created_at timestamp default now() not null
);

create table dev_monthly_invoices (
  id bigint not null primary key,
  created_at timestamp default now() not null,
  couple_id bigint references dev_couples (id),
  total_amount bigint not null,
  is_paid boolean not null,
  updated_at timestamp default now()
);

create table dev_payments (
  id bigint not null primary key,
  created_at timestamp default now() not null,
  updated_at timestamp default now() not null,
  monthly_invoice_id bigint references dev_monthly_invoices (id),
  amount bigint not null,
  quantity bigint not null,
  name text not null
);

