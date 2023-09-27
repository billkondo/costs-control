// Utils

type Override<What, With> = Omit<What, keyof With> & With;

type Without<T, K> = {
  [L in Exclude<keyof T, K>]: T[L];
};

type withID = {
  id: string;
};

type GetQuery<T> = (params: QueryParams<T>) => FirestoreQuery<T>;

type ValidationError<T> = {
  [Property in keyof T]?: string;
};

type Mode = keyof FirebaseConfig;

// QueryParams

type QueryParams<T> = {
  userId: string;
  maxSize?: number;
  lastDocument?: QueryDocumentSnapshot<
    import('firebase/firestore').QueryDocumentSnapshot<T>
  >;
  orderBy?: [
    field: string,
    order?: import('firebase/firestore').OrderByDirection
  ];
};

// Firebase

type FirebaseConfig = {
  development?: object;
  production?: object;
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

// Date

type Month = {
  month: number;
  year: number;
};

// User

type User = {
  name: string;
  email: string;
};

type UserLogin = User & {
  password: string;
};

type AddUserRequest = UserLogin;

// Payments

type PaymentType = 'DEBIT' | 'CREDIT' | 'CASH';

type PaymentDate = {
  month: number;
  year: number;
};

type Payment = {
  partsCount: number;
  partsValue: number;
  paymentDates: PaymentDate[];
  isImmediate: boolean;
};

// Stores

type Store = {
  name: string;
};

type StoreError = ValidationError<Store>;

type UserStore = {
  id: string;
  userId: string;
} & Store;

type UserStoreDBData = UserStore;

type AddStoreRequest = Store;
type AddStoreResponse = UserStore;

// Cards

type Card = {
  name: string;
  lastFourDigits: number;
  lastBuyDay: number;
};

type CardError = ValidationError<Card>;

type UserCard = {
  id: string;
  userId: string;
} & Card;

type UserCardDBData = UserCard;

type AddCardRequest = Card;
type AddCardResponse = UserCard;

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

type ExpenseError = ValidationError<Expense>;

type UserExpense = {
  id: string;
  userId: string;
  paymentDates: string[];
  month: number;
  year: number;
  paymentEndKey: number;
} & Expense;

type IncompleteUserExpense = Omit<UserExpense, 'store' | 'card'> & {
  storeId: string;
  cardId: string | null;
};

type UserExpenseDBData = Override<
  IncompleteUserExpense,
  {
    buyDate: import('firebase/firestore').Timestamp;
  }
>;

type AddExpenseRequest = Override<
  Expense,
  {
    buyDate: string;
  }
>;

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
  startDate: Date;
  endDate: Date | null;
  card: UserCard;
};

type SubscriptionError = ValidationError<Subscription>;

type UserSubscription = {
  id: string;
  userId: string;
  startMonth: number;
  startYear: number;
  paymentStartMonth: number;
  paymentStartYear: number;
  endMonth: number | null;
  endYear: number | null;
  paymentEndMonth: number | null;
  paymentEndYear: number | null;
} & Subscription;

type IncompleteUserSubscription = Omit<UserSubscription, 'card'> & {
  cardId: string;
};

type UserSubscriptionDBData = Override<
  IncompleteUserSubscription,
  {
    startDate: import('firebase/firestore').Timestamp;
    endDate: import('firebase/firestore').Timestamp | null;
  }
>;

type AddSubscriptionRequest = Override<
  Subscription,
  { startDate: string; endDate: string | null }
>;

type AddSubscriptionResponse = Override<
  IncompleteUserSubscription,
  {
    startDate: string;
    endDate: string | null;
  }
>;
