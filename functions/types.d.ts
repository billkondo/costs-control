// Firebase

type QueryDocumentSnapshot<T> =
  import('firebase-admin/firestore').QueryDocumentSnapshot<T>;

type CreateEvent<T> = import('firebase-functions/v2').firestore.FirestoreEvent<
  QueryDocumentSnapshot<T>,
  { docId: string }
>;

type DeleteEvent<T> = CreateEvent<T>;

type UpdateEvent<T> = import('firebase-functions/v2').firestore.FirestoreEvent<
  import('firebase-functions/v2').Change<QueryDocumentSnapshot<T>>,
  { docId: string }
>;

type Collection<T> = import('firebase-admin/firestore').CollectionReference<T>;

type FunctionCall<T> = import('firebase-functions/v2/https').CallableRequest<T>;

// Expenses

type UserExpenseDBData = {
  id: string;
  userId: string;
  value: number;
  buyDate: import('firebase-admin/firestore').Timestamp;
  storeId: string;
  paymentType: PaymentType;
  isInstallment: boolean;
  partsCount: number;
  cardId: string;
  paymentDates: string[];
};
