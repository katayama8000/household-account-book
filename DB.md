 +-----------------+
 |     couples     |
 +-----------------+
 | id (PK)         |
 | user1_id        |
 | user2_id        |
 | created_at      |
 | updated_at      |
 +-----------------+
           |
           |
           | 1:M
           |
           v
 +----------------------+
 |   monthly_invoices   |
 +----------------------+
 | id (PK)              |
 | couple_id (FK)       |
 | is_paid              |
 | created_at           |
 | updated_at           |
 +----------------------+
           |
           |
           | 1:M
           |
           v
 +----------------------+
 |      payments        |
 +----------------------+
 | id (PK)              |
 | monthly_invoice_id (FK) |
 | amount               |
 | name                 |
 | created_at           |
 | updated_at           |
 +----------------------+
