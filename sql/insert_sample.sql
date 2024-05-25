INSERT INTO monthly_bills (user_id, month, total_amount, is_paid, created_at, updated_at)
VALUES ('user_id', '2024-06-01', 100.0, FALSE, NOW(), NOW());

INSERT INTO payments (monthly_bill_id, amount, payment_date, created_at, updated_at)
VALUES (1, 100.0, '2024-06-30', NOW(), NOW());
