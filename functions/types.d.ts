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

type FirebaseCollection<T> =
  import('firebase-admin/firestore').CollectionReference<T>;
