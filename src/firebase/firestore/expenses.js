import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '..';
import getCurrentMonthDateString from '../../utils/date/getCurrentMonthDateString';

/**
 * @returns {FirestoreCollectionReference<UserExpenseDBData>}
 */
const getExpensesCollection = () => {
  // @ts-ignore
  return collection(db, 'expenses');
};

/**
 * @param {string} userId
 * @param {(currentMonthExpenses: UserExpense[]) => void} onCurrentMonthExpensesChanged
 */
const currentMonthListener = (userId, onCurrentMonthExpensesChanged) => {
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
const currentMonthGetCount = async (userId) => {
  const query = getCurrentMonthExpensesBaseQuery(userId);
  const snapshot = await getCountFromServer(query);

  return snapshot.data().count;
};

/**
 * @param {string} userId
 * @returns {Promise<UserExpense[]>}
 */
const currentMonthGetAll = async (userId) => {
  const query = getCurrentMonthExpensesBaseQuery(userId, null);
  const snapshot = await getDocs(query);
  const expenses = snapshot.docs.map(mapUserExpenseDocToUserExpense);

  return expenses;
};

/**
 * @param {string} userId
 * @param {number=} maxSize
 */
const getCurrentMonthExpensesBaseQuery = (userId, maxSize = 5) => {
  const currentMonthDateString = getCurrentMonthDateString();

  /** @type {import('firebase/firestore').QueryNonFilterConstraint[]} */
  const constraints = [orderBy('buyDate', 'desc')];

  if (maxSize) {
    constraints.push(limit(maxSize));
  }

  return query(
    getExpensesCollection(),
    where('paymentDates', 'array-contains', currentMonthDateString),
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
    ...data,
    id: doc.id,
    userId: data.userId,
    buyDate: data.buyDate.toDate(),
    store: null,
    card: null,
  };

  return userExpense;
};

export default {
  currentMonth: {
    listener: currentMonthListener,
    getCount: currentMonthGetCount,
    getAll: currentMonthGetAll,
  },
};
