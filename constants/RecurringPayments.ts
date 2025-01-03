import type { Dayjs } from "dayjs";

export const RecurringPayments = (startOfNextMonth: Dayjs) => {
  const daysInMonth = startOfNextMonth.daysInMonth();
  const formattedDate = startOfNextMonth.format("YYYY-MM");
  const recurringPayments = [
    { amount: 2000, item: "ガソリン", memo: "自動追加" },
    { amount: 3750, item: "通信費", memo: "自動追加" },
    {
      amount: 1000 * daysInMonth,
      item: "家賃",
      memo: `自動追加 ${formattedDate} ${daysInMonth}日間`,
    },
  ] as const;

  return recurringPayments;
};
