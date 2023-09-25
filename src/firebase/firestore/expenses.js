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
import getConstraints from './getConstraints';
import Pager from './Pager';
import getMonthKey from '../../../common/getMonthKey';

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
 * @param {string} userId
 * @returns {(start?: number) => Promise<IncompleteUserExpense[]>}
 */
const getOngoingExpensesPager = (userId) => {
  const pager = Pager(userId, getOngoingExpensesQuery);

  const callback =
    /**
     * @param {number} [start]
     */
    async (start) => {
      const expenses = await pager(start);

      return expenses.map(mapUserExpenseDBDataToIncompleteUserExpense);
    };

  return callback;
};

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
const getOngoingExpensesCount = async (userId) => {
  const query = getOngoingExpensesQuery({ userId });
  const snapshot = await getCountFromServer(query);

  return snapshot.data().count;
};

/**
 * @param {QueryParams<UserExpenseDBData>} params
 * @returns {FirestoreQuery<UserExpenseDBData>}
 */
const getOngoingExpensesQuery = (params) => {
  const { userId } = params;
  const constraints = getConstraints(params);
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  /** @type {Month} */
  const month = {
    month: currentMonth,
    year: currentYear,
  };
  const monthKey = getMonthKey(month);

  return query(
    expensesCollection,
    and(
      where('userId', '==', userId),
      where('paymentType', '==', 'CREDIT'),
      where('paymentEndKey', '>=', monthKey)
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

  return mapUserExpenseDBDataToIncompleteUserExpense({
    ...data,
    id: doc.id,
  });
};

/**
 * @param {UserExpenseDBData} dbData
 * @returns {IncompleteUserExpense}
 */
const mapUserExpenseDBDataToIncompleteUserExpense = (dbData) => {
  /** @type {IncompleteUserExpense} */
  const incompleteUserExpense = {
    ...dbData,
    buyDate: dbData.buyDate.toDate(),
  };

  return incompleteUserExpense;
};

export default {
  currentMonth: {
    listener: currentMonthListener,
    getCount: currentMonthGetCount,
    getAll: currentMonthGetAll,
  },
  ongoing: {
    count: getOngoingExpensesCount,
    pager: getOngoingExpensesPager,
  },
};
