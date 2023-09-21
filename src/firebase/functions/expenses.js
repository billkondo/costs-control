import { httpsCallable } from 'firebase/functions';
import { functions } from '..';

/** @type {FunctionCall<AddExpenseRequest, undefined>} */
const addExpenseFunction = httpsCallable(functions, 'addExpense');

/**
 * @param {Expense} expense
 * @returns {Promise<void>}
 */
const add = async (expense) => {
  await addExpenseFunction({
    ...expense,
    buyDate: expense.buyDate.toISOString(),
  });
};

export default {
  add,
};
