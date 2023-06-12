type Expense = {
  value: number;
  date: Date;
};

type UserExpense = {
  id: string;
  userId: string;
} & Expense;

type UserExpenseDBData = {
  id: string;
  userId: string;
  value: number;
  date: import('firebase/firestore').Timestamp;
};

type MonthlyExpense = {
  month: number;
  year: number;
  value: number;
};

type UserMonthlyExpense = {
  id: string;
  userId: string;
} & MonthlyExpense;

type UserMonthlyExpenseDBData = {
  id: string;
  userId: string;
  month: number;
  year: number;
  value: number;
};
