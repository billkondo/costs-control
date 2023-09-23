import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '..';
import getCurrentMonth from '../../utils/date/getCurrentMonth';
import getCurrentYear from '../../utils/date/getCurrentYear';
import getLatestMonths from '../../utils/date/getLatestMonths';

/** @type {FirestoreCollectionReference<UserMonthlyExpenseDBData>} */
// @ts-ignore
const monthlyExpensesCollection = collection(db, 'monthlyExpenses');

/**
 * @param {string} userId
 * @param {(monthlyExpense: UserMonthlyExpense) => void} onCurrentMonthExpenseChanged
 * @returns {import('firebase/firestore').Unsubscribe}
 */
const currentMonthlyExpenseListener = (
  userId,
  onCurrentMonthExpenseChanged
) => {
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const currentMonthExpenseQuery = query(
    monthlyExpensesCollection,
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
 * @param {string} userId
 * @param {(latestMonthlyExpenses: MonthlyExpense[]) => void} onLatestMonthlyExpensesChanged
 */
const latestMonthlyExpensesListener = (
  userId,
  onLatestMonthlyExpensesChanged
) => {
  const latestMonths = getLatestMonths();
  const queries = latestMonths.map(({ month, year }) => {
    return {
      month,
      year,
      query: query(
        monthlyExpensesCollection,
        where('month', '==', month),
        where('year', '==', year),
        where('userId', '==', userId)
      ),
    };
  });

  /** @type {MonthlyExpense[]} */
  const monthlyExpenses = latestMonths.map(({ month, year }) => {
    return {
      month,
      year,
      value: 0,
    };
  });

  onLatestMonthlyExpensesChanged(monthlyExpenses);

  const unsubscribes = queries.map((latestMonthQuery, index) => {
    const { query } = latestMonthQuery;

    return onSnapshot(query, (querySnapshot) => {
      if (!querySnapshot.docs.length) {
        return;
      }

      const changedMonthlyExpense = querySnapshot.docs[0].data();

      monthlyExpenses[index] = changedMonthlyExpense;

      onLatestMonthlyExpensesChanged([...monthlyExpenses]);
    });
  });

  const unsubscribeAll = () => {
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }
  };

  return unsubscribeAll;
};

export default {
  currentMonth: {
    listener: currentMonthlyExpenseListener,
  },
  latestMonths: {
    listener: latestMonthlyExpensesListener,
  },
};
