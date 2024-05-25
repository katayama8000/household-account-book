 +----------------------+
 |    monthly_bills     |
 +----------------------+
 | id (PK)              |
 | user_id              |
 | month                |
 | total_amount         |
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
 | monthly_bill_id (FK) |
 | amount               |
 | payment_date         |
 | created_at           |
 | updated_at           |
 +----------------------+

 