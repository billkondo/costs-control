import {
  collection,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  doc,
  setDoc,
  Timestamp,
  getDocs,
  or,
  and,
  getCountFromServer,
  startAfter,
} from 'firebase/firestore';
import { db } from '.';

const getExpensesCollection = () => {
  return collection(db, 'expenses');
};

const getMonthlyExpenses = () => {
  return collection(db, 'monthlyExpenses');
};

/**
 * @returns {FirestoreCollectionReference<UserSubscriptionDBData>}
 */
const getSubscriptionsCollection = () => {
  // @ts-ignore
  return collection(db, 'subscriptions');
};

const getFixedCostsCollection = () => {
  return collection(db, 'fixedCosts');
};

const getMonthlyFixedCostsCollection = () => {
  return collection(db, 'monthlyFixedCosts');
};

/**
 * @param {UserExpense} userExpense
 */
export const addUserExpense = async (userExpense) => {
  const userExpenseRef = doc(getExpensesCollection());

  /** @type {UserExpenseDBData} */
  const userExpenseDBData = {
    ...userExpense,
    id: userExpenseRef.id,
    date: Timestamp.fromDate(userExpense.date),
  };

  await setDoc(userExpenseRef, userExpenseDBData);
};

/**
 * @param {string} userId
 * @param {(latestExpenses: UserExpense[]) => void} onLatestExpensesChanged
 */
export const latestExpensesListener = (userId, onLatestExpensesChanged) => {
  const latestExpensesQuery = query(
    getExpensesCollection(),
    orderBy('date', 'desc'),
    where('userId', '==', userId),
    limit(10)
  );

  const unsubscribe = onSnapshot(latestExpensesQuery, (querySnapshot) => {
    const latestExpenses = querySnapshot.docs.map((doc) => {
      /** @type {UserExpenseDBData} */
      // @ts-ignore
      const userExpenseDBData = doc.data();

      /** @type {UserExpense} */
      const userExpense = {
        id: doc.id,
        userId,
        date: userExpenseDBData.date.toDate(),
        value: userExpenseDBData.value,
      };

      return userExpense;
    });

    onLatestExpensesChanged(latestExpenses);
  });

  return unsubscribe;
};

/**
 * @param {string} userId
 * @param {(monthlyExpense: UserMonthlyExpense) => void} onCurrentMonthExpenseChanged
 */
export const currentMonthExpenseListener = (
  userId,
  onCurrentMonthExpenseChanged
) => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  const currentMonthExpenseQuery = query(
    getMonthlyExpenses(),
    where('month', '==', currentMonth),
    where('year', '==', currentYear),
    where('userId', '==', userId)
  );

  const unsubscribe = onSnapshot(currentMonthExpenseQuery, (querySnapshot) => {
    if (!querySnapshot.docs.length) {
      return null;
    }

    /** @type {UserMonthlyExpenseDBData} */
    // @ts-ignore
    const userMonthlyExpenseDBData = querySnapshot.docs[0].data();

    onCurrentMonthExpenseChanged({
      ...userMonthlyExpenseDBData,
    });
  });

  return unsubscribe;
};

/**
 * @param {UserSubscription} userSubscription
 */
export const addUserSubscription = async (userSubscription) => {
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
export const getUserSubscriptions = async (userId) => {
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
 * @param {(fixedCost: FixedCost) => void} onFixedCostChanged
 */
export const fixedCostListener = (userId, onFixedCostChanged) => {
  const fixedCostQuery = query(
    getFixedCostsCollection(),
    where('userId', '==', userId)
  );

  const unsubscribe = onSnapshot(fixedCostQuery, (querySnapshot) => {
    if (!querySnapshot.docs.length) {
      return null;
    }

    /** @type {UserFixedCostDBData} */
    // @ts-ignore
    const userFixedCostDBData = querySnapshot.docs[0].data();

    onFixedCostChanged({ ...userFixedCostDBData });
  });

  return unsubscribe;
};

/**
 * @param {string} userId
 * @param {(monthlyFiexCost: UserMonthlyFixedCost) => void} onMonthlyFixedCostChanged
 */
export const monthlyFixedCostsListener = (
  userId,
  onMonthlyFixedCostChanged
) => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();

  const monthlyFixedCostQuery = query(
    getMonthlyFixedCostsCollection(),
    where('userId', '==', userId),
    where('month', '==', currentMonth)
  );

  const unsubscribe = onSnapshot(monthlyFixedCostQuery, (querySnapshot) => {
    if (!querySnapshot.docs.length) {
      return null;
    }

    /** @type {UserMonthlyFixedCostDBData} */
    // @ts-ignore
    const monthlyFixedCostDBData = querySnapshot.docs[0].data();

    onMonthlyFixedCostChanged(monthlyFixedCostDBData);
  });

  return unsubscribe;
};

/**
 * @param {string} userId
 * @param {(subscriptions: UserSubscription[]) => void} onCurrentMonthSubscriptionsChanged
 */
export const currentMonthSubscriptionsListener = (
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
export const getCurrentMonthSubscriptionsLength = async (userId) => {
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
 * @param {FirestoreQueryDocumentSnapshot<UserSubscription>=} start
 * @param {number=} maxSize
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
