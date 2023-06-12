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
} from 'firebase/firestore';
import { db } from '.';

const getExpensesCollection = () => {
  return collection(db, 'expenses');
};

const getMonthlyExpenses = () => {
  return collection(db, 'monthlyExpenses');
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
    orderBy('date'),
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
