import { useContext, useRef } from 'react';
import { ExpensesContext } from '../providers/ExpensesProvider';

/**
 * @typedef {object} FormTarget
 * @property {HTMLInputElement} value
 * @property {HTMLInputElement} date
 */

const ExpenseForm = () => {
  /** @type {import('react').Ref<HTMLFormElement>} */
  const formRef = useRef(null);
  const { addExpense } = useContext(ExpensesContext);

  /**
   * @param {import("react").SyntheticEvent} event
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    /** @type {EventTarget & FormTarget} */
    // @ts-ignore
    const target = event.target;

    const value = target.value.valueAsNumber;
    const date = target.date.valueAsDate;

    /** @type {Expense} */
    const expense = {
      value,
      date,
    };

    await addExpense(expense);

    formRef.current.reset();
  };

  return (
    <form onSubmit={onSubmit} noValidate ref={formRef}>
      <label htmlFor="expense-value">Value</label>
      <input name="value" id="expense-value" type="number"></input>
      <label htmlFor="expense-date">Date</label>
      <input name="date" id="expense-date" type="date"></input>
      <input type="submit" value="Create expense" />
    </form>
  );
};

export default ExpenseForm;
