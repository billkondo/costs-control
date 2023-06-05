import PropTypes from 'prop-types';
import { createContext, useContext } from 'react';
import * as FirebaseFirestore from '../firebase/firestore';
import { AuthenticationContext } from './AuthenticationProvider';

/**
 * @typedef {object} ExpensesState
 * @property {(expense: import('../types/expenses').Expense) => Promise<void>} addExpense
 */

/** @type {ExpensesState} */
const defaultExpensesState = {};

/** @type {import("react").Context<ExpensesState>} */
export const ExpensesContext = createContext(defaultExpensesState);

/**
 * @param {import('react').PropsWithChildren} props
 */
const ExpensesProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useContext(AuthenticationContext);

  /**
   * @param {import("../types/expenses").Expense} expense
   */
  const addExpense = async (expense) => {
    /** @type {import('../types/expenses').UserExpense} */
    const userExpense = {
      ...expense,
      userId: authenticatedUserId,
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
