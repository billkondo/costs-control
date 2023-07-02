import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import * as FirebaseFirestore from '../firebase/firestore';
import { AuthenticationContext } from './AuthenticationProvider';

/**
 * @typedef {object} ExpensesState
 * @property {(expense: Expense) => Promise<void>} addExpense
 * @property {(subscription: Subscription) => Promise<void>} addSubscription
 * @property {UserSubscription[]} subscriptions
 */

/** @type {import("react").Context<ExpensesState>} */
export const ExpensesContext = createContext({
  addExpense: async () => {},
  addSubscription: async () => {},
  subscriptions: [],
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
      id: null,
      userId: authenticatedUserId,
      date: expense.date,
      value: expense.value,
    };

    await FirebaseFirestore.addUserExpense(userExpense);
  };

  /**
   * @param {Subscription} subscription
   */
  const addSubscription = async (subscription) => {
    /** @type {UserSubscription} */
    const userSubscription = {
      ...subscription,
      userId: authenticatedUserId,
      id: null,
    };

    await FirebaseFirestore.addUserSubscription(userSubscription);

    setSubscriptions(subscriptions.concat([userSubscription]));
  };

  return (
    <ExpensesContext.Provider
      value={{ addExpense, addSubscription, subscriptions }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

ExpensesProvider.propTypes = {
  children: PropTypes.node,
};

export default ExpensesProvider;
