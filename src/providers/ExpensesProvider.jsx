import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as FirebaseFirestore from '../firebase/firestore';
import { AuthenticationContext } from './AuthenticationProvider';

/**
 * @typedef {object} ExpensesState
 * @property {(expense: Expense) => Promise<void>} addExpense
 * @property {UserSubscription[]} subscriptions
 * @property {number} currentMonthExpensesCount
 * @property {UserExpense[]} currentMonthExpenses,
 * @property {() => Promise<void>} loadCurrentMonthExpenses
 */

/** @type {import("react").Context<ExpensesState>} */
export const ExpensesContext = createContext({
  addExpense: async () => {},
  subscriptions: [],
  currentMonthExpensesCount: 0,
  currentMonthExpenses: [],
  loadCurrentMonthExpenses: async () => {},
});

/**
 * @param {import('react').PropsWithChildren} props
 */
const ExpensesProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useContext(AuthenticationContext);

  const [subscriptions, setSubscriptions] = useState(
    /** @type {UserSubscription[]} /*/ ([])
  );

  const [currentMonthExpensesCount, setCurrentMonthExpensesCount] = useState(0);

  const loadCurrentMonthExpensesCount = useCallback(async () => {
    const count = await FirebaseFirestore.getCurrentMonthSubscriptionsLength(
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

    const expenses = await FirebaseFirestore.getAllCurrentMonthExpenses(
      authenticatedUserId
    );

    setLoaded(true);
    setCurrentMonthExpenses(expenses);
  }, [authenticatedUserId, loaded]);

  useEffect(() => {
    const loadSubscriptions = async () => {
      const subscriptions = await FirebaseFirestore.getUserSubscriptions(
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

    await FirebaseFirestore.addUserExpense(userExpense);
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
