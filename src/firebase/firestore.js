import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '.';

const getExpensesCollection = () => {
  return collection(db, 'expenses');
};

/**
 * @param {import('../types/expenses').UserExpense} userExpense
 */
export const addUserExpense = async (userExpense) => {
  await addDoc(getExpensesCollection(), userExpense);
};

/**
 * @param {string} userId
 * @param {(latestExpenses: import('../types/expenses').UserExpense[]) => void} onLatestExpensesChanged
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
      const data = doc.data();

      /** @type {import('../types/expenses').UserExpense} */
      const userExpense = {
        date: data.date.toDate(),
        userId: data.userId,
        value: data.value,
      };

      return userExpense;
    });

    onLatestExpensesChanged(latestExpenses);
  });

  return unsubscribe;
};
