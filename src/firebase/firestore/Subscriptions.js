import {
  and,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  or,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
} from 'firebase/firestore';
import { db } from '..';

/**
 * @returns {FirestoreCollectionReference<UserSubscriptionDBData>}
 */
const getSubscriptionsCollection = () => {
  // @ts-ignore
  return collection(db, 'subscriptions');
};

/**
 * @param {UserSubscription} userSubscription
 */
const add = async (userSubscription) => {
  const userSubscriptionRef = doc(getSubscriptionsCollection());

  userSubscription.id = userSubscriptionRef.id;

  /** @type {UserSubscriptionDBData} */
  const userSubscriptionDBData = {
    ...userSubscription,
  };

  await setDoc(userSubscriptionRef, userSubscriptionDBData);
};

/**
 * @param {string} userId
 */
const getAll = async (userId) => {
  const userSubscriptionsQuery = query(
    getSubscriptionsCollection(),
    where('userId', '==', userId)
  );

  const docs = await getDocs(userSubscriptionsQuery);

  const userSubscriptions = docs.docs.map((doc) => {
    const data = doc.data();

    /** @type {UserSubscription} */
    const userSubscription = {
      id: data.id,
      day: data.day,
      month: data.month,
      type: data.type,
      userId: data.userId,
      value: data.value,
    };

    return userSubscription;
  });

  return userSubscriptions;
};

/**
 * @param {string} userId
 * @param {(subscriptions: UserSubscription[]) => void} onCurrentMonthSubscriptionsChanged
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export const currentMonthListener = (
  userId,
  onCurrentMonthSubscriptionsChanged
) => {
  const query = getCurrentMonthSubscriptionsBaseQuery(userId);

  const unsubscribe = onSnapshot(query, (querySnapshot) => {
    if (!querySnapshot.docs.length) {
      return null;
    }

    const userSubscriptionDBData = querySnapshot.docs.map((doc) => doc.data());

    onCurrentMonthSubscriptionsChanged(userSubscriptionDBData);
  });

  return unsubscribe;
};

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const currentMonthCount = async (userId) => {
  const query = getCurrentMonthSubscriptionsAllRecordsQuery(userId);
  const snapshot = await getCountFromServer(query);

  return snapshot.data().count;
};

/**
 * @param {string} userId
 */
const getCurrentMonthSubscriptionsAllRecordsQuery = (userId) => {
  return getCurrentMonthSubscriptionsBaseQuery(userId, null, null);
};

/**
 * @param {string} userId
 */
export const CurrentMonthSubscriptionsPager = (userId) => {
  /** @type {{ [index: number]: FirestoreQueryDocumentSnapshot<UserSubscription>}} */
  const cache = {};

  /**
   * @param {number} start
   */
  const callback = async (start = 0) => {
    const lastDocument = start ? cache[start] : null;
    const query = getCurrentMonthSubscriptionsBaseQuery(userId, lastDocument);
    const snapshot = await getDocs(query);
    const docs = snapshot.docs;
    const userSubscriptionDBData = docs.map((doc) => doc.data());
    const lastDocumentInQuery = docs[docs.length - 1];
    const lastIndex = start + userSubscriptionDBData.length;

    cache[lastIndex] = lastDocumentInQuery;

    return userSubscriptionDBData;
  };

  return callback;
};

/**
 * @param {string} userId
 * @param {FirestoreQueryDocumentSnapshot<UserSubscription> |  null} start
 * @param {number | null} maxSize
 */
const getCurrentMonthSubscriptionsBaseQuery = (
  userId,
  start = null,
  maxSize = 5
) => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();

  /** @type {import('firebase/firestore').QueryNonFilterConstraint[]} */
  const constraints = [orderBy('day')];

  if (maxSize) {
    constraints.push(limit(maxSize));
  }

  if (start) {
    constraints.push(startAfter(start));
  }

  return query(
    getSubscriptionsCollection(),
    and(
      where('userId', '==', userId),
      or(where('month', '==', currentMonth), where('month', '==', null))
    ),
    ...constraints
  );
};

export default {
  add,
  getAll,
  currentMonth: {
    listener: currentMonthListener,
    count: currentMonthCount,
  },
};
