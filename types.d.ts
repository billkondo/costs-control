// Utils

type Override<What, With> = Omit<What, keyof With> & With;

// QueryParams

type QueryParams<T> = {
  userId: string;
  maxSize?: number;
  lastDocument?: QueryDocumentSnapshot<
    import('firebase/firestore').QueryDocumentSnapshot<T>
  >;
};

// Firestore

type FirestoreQuery<T> = import('firebase/firestore').Query<T>;
type FirestoreCollectionReference<T> =
  import('firebase/firestore').CollectionReference<T>;
type FirestoreQueryDocumentSnapshot<T> =
  import('firebase/firestore').QueryDocumentSnapshot<T>;

// Functions

type FunctionCall<RequestData, ResponseData> =
  import('firebase/functions').HttpsCallable<RequestData, ResponseData>;

// Payments

type PaymentType = 'DEBIT' | 'CREDIT' | 'CASH';

// Stores

type Store = {
  name: string;
};

type UserStore = {
  id: string | null;
  userId: string;
} & Store;

type UserStoreDBData = UserStore;

// Cards

type Card = {
  name: string;
  lastFourDigits: number;
  lastBuyDay: number;
};

type UserCard = {
  id: string | null;
  userId: string;
} & Card;

type UserCardDBData = UserCard;

// Expenses

type Expense = {
  value: number;
  buyDate: Date;
  store: UserStore;
  paymentType: PaymentType;
  isInstallment: boolean;
  partsCount: number;
  card: UserCard | null;
};

type UserExpense = {
  id: string | null;
  userId: string;
} & Expense;

type UserExpenseRequest = Override<
  UserExpense,
  {
    buyDate: string;
  }
>;

type UserExpenseDBData = {
  id: string;
  userId: string;
  value: number;
  buyDate: import('firebase/firestore').Timestamp;
  storeId: string;
  paymentType: PaymentType;
  isInstallment: boolean;
  partsCount: number;
  cardId: string;
  paymentDates: string[];
};

type MonthlyExpense = {
  month: number;
  year: number;
  value: number;
};

type UserMonthlyExpense = {
  id: string | null;
  userId: string;
} & MonthlyExpense;

type UserMonthlyExpenseDBData = UserMonthlyExpense;

// Subscriptions

type SubscriptionType = 'MONTHLY' | 'YEARLY';

type Subscription = {
  value: number;
  type: SubscriptionType;
  day: number;
  month: number;
};

type UserSubscription = {
  id: string | null;
  userId: string;
} & Subscription;

type UserSubscriptionDBData = UserSubscription;

// Fixed Cost

type FixedCost = {
  value: number;
};

type UserFixedCost = {
  id: string | null;
  userId: string;
} & FixedCost;

type UserFixedCostDBData = UserFixedCost;

type MonthlyFixedCost = {
  value: number;
  month: number;
};

type UserMonthlyFixedCost = {
  id: string | null;
  userId: string;
} & MonthlyFixedCost;

type UserMonthlyFixedCostDBData = UserMonthlyFixedCost;
