import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useState } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import FirebaseFunctions from '../firebase/functions';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} ExpensesState
 * @property {(expense: Expense) => Promise<void>} addExpense
 * @property {UserSubscription[]} subscriptions
 * @property {number} currentMonthExpensesCount
 * @property {UserExpense[]} currentMonthExpenses,
 * @property {() => Promise<void>} loadCurrentMonthExpenses
 */

/** @type {ExpensesState} */
const defaultExpensesState = {
  addExpense: async () => {},
  subscriptions: [],
  currentMonthExpensesCount: 0,
  currentMonthExpenses: [],
  loadCurrentMonthExpenses: async () => {},
};

export const ExpensesContext = createContext(defaultExpensesState);

/**
 * @param {import('react').PropsWithChildren} props
 */
const ExpensesProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useAuthentication();

  const [subscriptions, setSubscriptions] = useState(
    /** @type {UserSubscription[]} /*/ ([])
  );

  const [currentMonthExpensesCount, setCurrentMonthExpensesCount] = useState(0);

  const loadCurrentMonthExpensesCount = useCallback(async () => {
    const count = await FirebaseFirestore.expenses.currentMonth.getCount(
      authenticatedUserId
    );

    setCurrentMonthExpensesCount(count);
  }, [authenticatedUserId]);

  useEffect(() => {
    loadCurrentMonthExpensesCount();
  }, [loadCurrentMonthExpensesCount]);

  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(
    /** @type {UserExpense[]} */ ([])
  );
  const [loaded, setLoaded] = useState(false);

  const loadCurrentMonthExpenses = useCallback(async () => {
    if (loaded) {
      return;
    }

    const expenses = await FirebaseFirestore.expenses.currentMonth.getAll(
      authenticatedUserId
    );

    setLoaded(true);
    setCurrentMonthExpenses(expenses);
  }, [authenticatedUserId, loaded]);

  useEffect(() => {
    const loadSubscriptions = async () => {
      const subscriptions = await FirebaseFirestore.Subscriptions.getAll(
        authenticatedUserId
      );

      setSubscriptions(subscriptions);
    };

    loadSubscriptions();
  }, [authenticatedUserId]);

  /**
   * @param {Expense} expense
   */
  const addExpense = async (expense) => {
    /** @type {UserExpense} */
    const userExpense = {
      ...expense,
      id: null,
      userId: authenticatedUserId,
    };

    await FirebaseFunctions.expenses.add(userExpense);
  };

  return (
    <ExpensesContext.Provider
      value={{
        addExpense,
        subscriptions,
        currentMonthExpensesCount,
        currentMonthExpenses,
        loadCurrentMonthExpenses,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

ExpensesProvider.propTypes = {
  children: PropTypes.node,
};

export default ExpensesProvider;
