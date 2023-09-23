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
  where,
} from 'firebase/firestore';
import { db } from '..';
import getCurrentMonthDateString from '../../utils/date/getCurrentMonthDateString';
import getCurrentMonth from '../../utils/date/getCurrentMonth';
import getCurrentYear from '../../utils/date/getCurrentYear';

/** @type {FirestoreCollectionReference<UserExpenseDBData>} */
// @ts-ignore
const expensesCollection = collection(db, 'expenses');

/**
 * @param {string} userId
 * @param {(currentMonthExpenses: IncompleteUserExpense[]) => void} onCurrentMonthExpensesChanged
 */
const currentMonthListener = (userId, onCurrentMonthExpensesChanged) => {
  const expensesQuery = getCurrentMonthExpensesBaseQuery(userId);

  const unsubscribe = onSnapshot(expensesQuery, (querySnapshot) => {
    const currentMonthExpenses = querySnapshot.docs.map(
      mapUserExpenseDocToIncompleteUserExpense
    );

    onCurrentMonthExpensesChanged(currentMonthExpenses);
  });

  return unsubscribe;
};

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
const currentMonthGetCount = async (userId) => {
  const query = getCurrentMonthExpensesBaseQuery(userId);
  const snapshot = await getCountFromServer(query);

  return snapshot.data().count;
};

/**
 * @param {string} userId
 * @returns {Promise<IncompleteUserExpense[]>}
 */
const currentMonthGetAll = async (userId) => {
  const query = getCurrentMonthExpensesBaseQuery(userId, null);
  const snapshot = await getDocs(query);
  const expenses = snapshot.docs.map(mapUserExpenseDocToIncompleteUserExpense);

  return expenses;
};

/**
 * @param {string} userId
 * @param {number | null} maxSize
 */
const getCurrentMonthExpensesBaseQuery = (userId, maxSize = 5) => {
  const currentMonthDateString = getCurrentMonthDateString();

  /** @type {import('firebase/firestore').QueryNonFilterConstraint[]} */
  const constraints = [orderBy('buyDate', 'desc')];

  if (maxSize) {
    constraints.push(limit(maxSize));
  }

  return query(
    expensesCollection,
    and(
      or(
        where('paymentDates', 'array-contains', currentMonthDateString),
        and(
          where('month', '==', getCurrentMonth()),
          where('year', '==', getCurrentYear())
        )
      ),
      where('userId', '==', userId)
    ),
    ...constraints
  );
};

/**
 * @param {FirestoreQueryDocumentSnapshot<UserExpenseDBData>} doc
 * @returns {IncompleteUserExpense}
 */
const mapUserExpenseDocToIncompleteUserExpense = (doc) => {
  const data = doc.data();

  /** @type {IncompleteUserExpense} */
  const incompleteUserExpense = {
    ...data,
    id: doc.id,
    userId: data.userId,
    buyDate: data.buyDate.toDate(),
  };

  return incompleteUserExpense;
};

export default {
  currentMonth: {
    listener: currentMonthListener,
    getCount: currentMonthGetCount,
    getAll: currentMonthGetAll,
  },
};
