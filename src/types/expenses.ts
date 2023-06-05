export type Expense = {
  value: number;
  date: Date;
};

export type UserExpense = {
  userId: string;
} & Expense;
