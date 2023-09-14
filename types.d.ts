// Firestore

type FirestoreQuery<T> = import('firebase/firestore').Query<T>;
type FirestoreCollectionReference<T> =
  import('firebase/firestore').CollectionReference<T>;
type FirestoreQueryDocumentSnapshot<T> =
  import('firebase/firestore').QueryDocumentSnapshot<T>;

// Payments

type PaymentType = 'DEBIT' | 'CREDIT' | 'CASH';

// Cards

type Card = {
  name: string;
  lastFourDigits: number;
  lastBuyDay: number;
};

type UserCard = {
  id: string;
  userId: string;
} & Card;

type UserCardDBData = UserCard;

// Expenses

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

// Subscriptions

type SubscriptionType = 'MONTHLY' | 'YEARLY';

type Subscription = {
  value: number;
  type: SubscriptionType;
  day: number;
  month: number;
};

type UserSubscription = {
  id: string;
  userId: string;
} & Subscription;

type UserSubscriptionDBData = UserSubscription;

// Fixed Cost

type FixedCost = {
  value: number;
};

type UserFixedCost = {
  id: string;
  userId: string;
} & FixedCost;

type UserFixedCostDBData = UserFixedCost;

type MonthlyFixedCost = {
  value: number;
  month: number;
};

type UserMonthlyFixedCost = {
  id: string;
  userId: string;
} & MonthlyFixedCost;

type UserMonthlyFixedCostDBData = UserMonthlyFixedCost;
