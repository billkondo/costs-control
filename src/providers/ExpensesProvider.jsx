import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useState } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import FirebaseFunctions from '../firebase/functions';
import useIncompleteExpenses from '../usecases/useIncompleteExpenses';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} ExpensesState
 * @property {(expense: Expense) => Promise<void>} addExpense
 * @property {number} currentMonthExpensesCount
 * @property {UserExpense[]} currentMonthExpenses,
 * @property {() => Promise<void>} loadCurrentMonthExpenses
 */

/** @type {ExpensesState} */
const defaultExpensesState = {
  addExpense: async () => {},
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

  const {
    expenses: currentMonthExpenses,
    setIncompleteExpenses: setCurrentMonthExpenses,
  } = useIncompleteExpenses();

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
  }, [authenticatedUserId, loaded, setCurrentMonthExpenses]);

  /**
   * @param {Expense} expense
   */
  const addExpense = async (expense) => {
    await FirebaseFunctions.expenses.add(expense);
  };

  return (
    <ExpensesContext.Provider
      value={{
        addExpense,
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
