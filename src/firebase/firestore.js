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
import getFirstDateOfMonth from '../utils/date/getFirstDateOfMonth';
import getCurrentMonth from '../utils/date/getCurrentMonth';
import getCurrentYear from '../utils/date/getCurrentYear';

/**
 * @returns {FirestoreCollectionReference<UserExpenseDBData>}
 */
const getExpensesCollection = () => {
  // @ts-ignore
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
 * @returns {FirestoreCollectionReference<UserCardDBData>}
 */
const getCardsCollection = () => {
  // @ts-ignore
  return collection(db, 'cards');
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
 * @param {(currentMonthExpenses: UserExpense[]) => void} onCurrentMonthExpensesChanged
 */
export const currentMonthExpensesListener = (
  userId,
  onCurrentMonthExpensesChanged
) => {
  const expensesQuery = getCurrentMonthExpensesBaseQuery(userId);

  const unsubscribe = onSnapshot(expensesQuery, (querySnapshot) => {
    const currentMonthExpenses = querySnapshot.docs.map(
      mapUserExpenseDocToUserExpense
    );

    onCurrentMonthExpensesChanged(currentMonthExpenses);
  });

  return unsubscribe;
};

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const getCurrentMonthExpensesLength = async (userId) => {
  const query = getCurrentMonthExpensesBaseQuery(userId);
  const snapshot = await getCountFromServer(query);

  return snapshot.data().count;
};

/**
 * @param {string} userId
 * @returns {Promise<UserExpense[]>}
 */
export const getAllCurrentMonthExpenses = async (userId) => {
  const query = getCurrentMonthExpensesBaseQuery(userId, null);
  const snapshot = await getDocs(query);
  const expenses = snapshot.docs.map(mapUserExpenseDocToUserExpense);

  return expenses;
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

/**
 * @param {string} userId
 * @param {number=} maxSize
 */
const getCurrentMonthExpensesBaseQuery = (userId, maxSize = 5) => {
  const firstDateOfCurrentMonth = getFirstDateOfMonth(
    getCurrentMonth(),
    getCurrentYear()
  );

  /** @type {import('firebase/firestore').QueryNonFilterConstraint[]} */
  const constraints = [orderBy('date', 'desc')];

  if (maxSize) {
    constraints.push(limit(maxSize));
  }

  return query(
    getExpensesCollection(),
    where('date', '>=', firstDateOfCurrentMonth),
    where('userId', '==', userId),
    ...constraints
  );
};

/**
 * @param {FirestoreQueryDocumentSnapshot<UserExpenseDBData>} doc
 * @returns {UserExpense}
 */
const mapUserExpenseDocToUserExpense = (doc) => {
  const data = doc.data();

  /** @type {UserExpense} */
  const userExpense = {
    id: doc.id,
    userId: data.userId,
    date: data.date.toDate(),
    value: data.value,
  };

  return userExpense;
};

/**
 * @param {UserCard} userCard
 * @returns {Promise<UserCard}
 */
export const addUserCard = async (userCard) => {
  const userCardRef = doc(getCardsCollection());

  /** @type {UserCardDBData} */
  const userCardDBData = {
    ...userCard,
    id: userCardRef.id,
  };

  await setDoc(userCardRef, userCardDBData);

  return userCardDBData;
};

/**
 * @param {string} userId
 * @returns {Promise<UserCard[]>}
 */
export const getUserCards = async (userId) => {
  const userCardsQuery = query(
    getCardsCollection(),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(userCardsQuery);

  return snapshot.docs.map((doc) => doc.data());
};
