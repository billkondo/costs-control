import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '..';
import getCurrentMonth from '../../utils/date/getCurrentMonth';
import getCurrentYear from '../../utils/date/getCurrentYear';
import getLatestMonths from '../../utils/date/getLatestMonths';
import getNextMonths from '../../utils/date/getNextMonths';

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
 * @param {(monthlyExpenses: MonthlyExpense[]) => void} onMonthlyExpensesChanged
 * @param {Month[]} months
 */
const monthlyExpensesListener = (userId, onMonthlyExpensesChanged, months) => {
  const queries = months.map(({ month, year }) => {
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
  const monthlyExpenses = months.map(({ month, year }) => {
    return {
      month,
      year,
      value: 0,
    };
  });

  onMonthlyExpensesChanged(monthlyExpenses);

  const unsubscribes = queries.map((latestMonthQuery, index) => {
    const { query } = latestMonthQuery;

    return onSnapshot(query, (querySnapshot) => {
      if (!querySnapshot.docs.length) {
        return;
      }

      const changedMonthlyExpense = querySnapshot.docs[0].data();

      monthlyExpenses[index] = changedMonthlyExpense;

      onMonthlyExpensesChanged([...monthlyExpenses]);
    });
  });

  const unsubscribeAll = () => {
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }
  };

  return unsubscribeAll;
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

  return monthlyExpensesListener(
    userId,
    onLatestMonthlyExpensesChanged,
    latestMonths
  );
};

/**
 *
 * @param {string} userId
 * @param {(nextMonthlyExpenses: MonthlyExpense[]) => void} onNextMonthlyExpensesChanged
 */
const nextMonthlyExpensesListener = (userId, onNextMonthlyExpensesChanged) => {
  const nextMonths = getNextMonths();

  return monthlyExpensesListener(
    userId,
    onNextMonthlyExpensesChanged,
    nextMonths
  );
};

export default {
  currentMonth: {
    listener: currentMonthlyExpenseListener,
  },
  latestMonths: {
    listener: latestMonthlyExpensesListener,
  },
  nextMonths: {
    listener: nextMonthlyExpensesListener,
  },
};
