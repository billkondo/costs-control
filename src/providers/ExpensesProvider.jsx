import PropTypes from 'prop-types';
import { createContext, useContext } from 'react';
import * as FirebaseFirestore from '../firebase/firestore';
import { AuthenticationContext } from './AuthenticationProvider';

/**
 * @typedef {object} ExpensesState
 * @property {(expense: Expense) => Promise<void>} addExpense
 */

/** @type {import("react").Context<ExpensesState>} */
export const ExpensesContext = createContext({
  addExpense: async () => {},
});

/**
 * @param {import('react').PropsWithChildren} props
 */
const ExpensesProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useContext(AuthenticationContext);

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

  return (
    <ExpensesContext.Provider value={{ addExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
};

ExpensesProvider.propTypes = {
  children: PropTypes.node,
};

export default ExpensesProvider;
