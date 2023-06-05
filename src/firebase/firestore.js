import { collection, addDoc } from 'firebase/firestore';
import { db } from '.';

const getExpensesCollection = () => {
  return collection(db, 'expenses');
};

/**
 * @param {import('../types/expenses').UserExpense} userExpense
 */
export const addUserExpense = async (userExpense) => {
  await addDoc(getExpensesCollection(), userExpense);
};
