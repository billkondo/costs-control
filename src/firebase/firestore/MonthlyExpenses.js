import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '..';

/**
 * @returns {FirestoreCollectionReference<UserMonthlyExpenseDBData>}
 */
const getMonthlyExpenses = () => {
  // @ts-ignore
  return collection(db, 'monthlyExpenses');
};

/**
 * @param {string} userId
 * @param {(monthlyExpense: UserMonthlyExpense) => void} onCurrentMonthExpenseChanged
 * @returns {import('firebase/firestore').Unsubscribe}
 */
const listener = (userId, onCurrentMonthExpenseChanged) => {
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

export default {
  listener,
};
