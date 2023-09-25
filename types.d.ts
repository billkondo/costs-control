// Utils

type Override<What, With> = Omit<What, keyof With> & With;

type Without<T, K> = {
  [L in Exclude<keyof T, K>]: T[L];
};

type withID = {
  id: string;
};

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

// Date

type Month = {
  month: number;
  year: number;
};

// User

type User = {
  name: string;
  email: string;
  timezone: string;
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

type UserExpense = {
  id: string;
  userId: string;
  paymentDates: string[];
  month: number;
  year: number;
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
};

type UserSubscription = {
  id: string;
  userId: string;
} & Subscription;

type UserSubscriptionDBData = Override<
  UserSubscription,
  {
    startDate: import('firebase/firestore').Timestamp;
    endDate: import('firebase/firestore').Timestamp | null;
  }
>;

type AddSubscriptionRequest = Override<
  Subscription,
  { startDate: string; endDate: string | null }
>;
