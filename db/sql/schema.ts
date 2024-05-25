interface Dev_couples {
  id: number /* primary key */;
  user1_id: number;
  user2_id: number;
  created_at: string;
}

interface Dev_monthly_invoices {
  id: number /* primary key */;
  created_at: string;
  couple_id: number /* foreign key to dev_couples.id */;
  total_amount: number;
  is_paid: boolean;
  updated_at?: string;
  dev_couples?: Dev_couples;
}

interface Dev_payments {
  id: number /* primary key */;
  created_at: string;
  updated_at: string;
  monthly_invoice_id: number /* foreign key to dev_monthly_invoices.id */;
  amount: number;
  quantity: number;
  name: string;
  dev_monthly_invoices?: Dev_monthly_invoices;
}
