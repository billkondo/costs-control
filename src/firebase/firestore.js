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
} from 'firebase/firestore';
import { db } from '.';

const getExpensesCollection = () => {
  return collection(db, 'expenses');
};

const getMonthlyExpenses = () => {
  return collection(db, 'monthlyExpenses');
};

const getSubscriptionsCollection = () => {
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

  /** @type {UserSubscription[]} */
  const userSubscriptions = docs.docs.map((doc) => {
    /** @type {UserSubscriptionDBData} */
    // @ts-ignore
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
  const now = new Date();
  const currentMonth = now.getUTCMonth();

  const currentMonthSubscriptions = query(
    getSubscriptionsCollection(),
    and(
      where('userId', '==', userId),
      or(where('month', '==', currentMonth), where('month', '==', null))
    ),
    limit(5),
    orderBy('day')
  );

  const unsubscribe = onSnapshot(currentMonthSubscriptions, (querySnapshot) => {
    if (!querySnapshot.docs.length) {
      return null;
    }

    /** @type {UserSubscriptionDBData[]} */
    // @ts-ignore
    const userSubscriptionDBData = querySnapshot.docs.map((doc) => doc.data());

    onCurrentMonthSubscriptionsChanged(
      userSubscriptionDBData.map((data) => {
        return {
          ...data,
        };
      })
    );
  });

  return unsubscribe;
};
