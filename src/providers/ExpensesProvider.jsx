import PropTypes from 'prop-types';
import { createContext, useCallback, useMemo, useState } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import FirebaseFunctions from '../firebase/functions';
import useIncompleteExpenses from '../usecases/useIncompleteExpenses';
import EventEmitter from '../utils/EventEmitter';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} ExpensesState
 * @property {(expense: Expense) => Promise<void>} addExpense
 * @property {UserExpense[]} currentMonthExpenses,
 * @property {() => Promise<void>} loadCurrentMonthExpenses
 * @property {EventEmitter} emmiter
 */

/** @type {ExpensesState} */
const defaultExpensesState = {
  addExpense: async () => {},
  currentMonthExpenses: [],
  loadCurrentMonthExpenses: async () => {},
  emmiter: new EventEmitter(),
};

export const ExpensesContext = createContext(defaultExpensesState);

/**
 * @param {import('react').PropsWithChildren} props
 */
const ExpensesProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useAuthentication();

  const emmiter = useMemo(() => {
    return new EventEmitter();
  }, []);

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

    emmiter.emit('update');
  };

  return (
    <ExpensesContext.Provider
      value={{
        addExpense,
        currentMonthExpenses,
        loadCurrentMonthExpenses,
        emmiter,
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
