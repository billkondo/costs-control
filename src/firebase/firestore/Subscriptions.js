import {
  and,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  or,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { db } from '..';

/** @type {FirestoreCollectionReference<UserSubscriptionDBData>} */
// @ts-ignore
const subscriptionsCollection = collection(db, 'subscriptions');

/**
 * @param {string} userId
 * @returns {Promise<IncompleteUserSubscription[]>}
 */
const getAll = async (userId) => {
  const userSubscriptionsQuery = query(
    subscriptionsCollection,
    where('userId', '==', userId)
  );

  const docs = await getDocs(userSubscriptionsQuery);

  const userSubscriptions = docs.docs.map(
    mapUserSubscriptionDBDataToIncompleteUserSubscription
  );

  return userSubscriptions;
};

/**
 * @param {string} userId
 * @param {(subscriptions: IncompleteUserSubscription[]) => void} onCurrentMonthSubscriptionsChanged
 * @returns {import('firebase/firestore').Unsubscribe}
 */
const currentMonthListener = (userId, onCurrentMonthSubscriptionsChanged) => {
  const query = getCurrentMonthSubscriptionsBaseQuery(userId);

  const unsubscribe = onSnapshot(query, (querySnapshot) => {
    if (!querySnapshot.docs.length) {
      return null;
    }

    const userSubscriptions = querySnapshot.docs.map(
      mapUserSubscriptionDBDataToIncompleteUserSubscription
    );

    onCurrentMonthSubscriptionsChanged(userSubscriptions);
  });

  return unsubscribe;
};

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
const currentMonthCount = async (userId) => {
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
  /** @type {{ [index: number]: FirestoreQueryDocumentSnapshot<UserSubscriptionDBData>}} */
  const cache = {};

  /**
   * @param {number} start
   */
  const callback = async (start = 0) => {
    const lastDocument = start ? cache[start] : null;
    const query = getCurrentMonthSubscriptionsBaseQuery(userId, lastDocument);
    const snapshot = await getDocs(query);
    const docs = snapshot.docs;
    const userSubscriptions = docs.map(
      mapUserSubscriptionDBDataToIncompleteUserSubscription
    );
    const lastDocumentInQuery = docs[docs.length - 1];
    const lastIndex = start + userSubscriptions.length;

    cache[lastIndex] = lastDocumentInQuery;

    return userSubscriptions;
  };

  return callback;
};

/**
 * @param {string} userId
 * @param {FirestoreQueryDocumentSnapshot<UserSubscriptionDBData> |  null} start
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
    subscriptionsCollection,
    and(
      where('userId', '==', userId),
      or(where('month', '==', currentMonth), where('month', '==', null))
    ),
    ...constraints
  );
};

/**
 *
 * @param {import('firebase/firestore').QueryDocumentSnapshot<UserSubscriptionDBData>} snapshot
 */
const mapUserSubscriptionDBDataToIncompleteUserSubscription = (snapshot) => {
  return mapUserSubscriptionDBDataToUserSubscription(snapshot.data());
};

/**
 * @param {UserSubscriptionDBData} dbData
 * @returns {IncompleteUserSubscription}
 */
const mapUserSubscriptionDBDataToUserSubscription = (dbData) => {
  return {
    ...dbData,
    startDate: dbData.startDate.toDate(),
    endDate: dbData.endDate ? dbData.endDate.toDate() : null,
  };
};

export default {
  getAll,
  currentMonth: {
    listener: currentMonthListener,
    count: currentMonthCount,
  },
};
