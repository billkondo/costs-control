import { Timestamp } from 'firebase-admin/firestore';
import { db } from '.';
import stringifyPaymentDates from '../../../common/strigifyPaymentDates';
import getExpensePaymentDates from '../../../common/getExpensePayment';

/** @type {Collection<UserExpenseDBData>} */
// @ts-ignore
const collection = db.collection('expenses');

/**
 * @param {string} userId
 * @param {Expense} expense
 */
const add = async (userId, expense) => {
  const { card, buyDate } = expense;
  const doc = collection.doc();

  /** @type {ServerUserExpenseDBData} */
  const expenseDBData = {
    id: doc.id,
    userId: userId,
    buyDate: Timestamp.fromDate(buyDate),
    storeId: expense.store.id,
    cardId: null,
    isInstallment: expense.isInstallment,
    partsCount: expense.partsCount,
    paymentType: expense.paymentType,
    value: expense.value,
    paymentDates: stringifyPaymentDates(
      getExpensePaymentDates(expense).paymentDates
    ),
    month: buyDate.getMonth(),
    year: buyDate.getFullYear(),
  };

  if (card) {
    expenseDBData.cardId = card.id;
  }

  await doc.set(expenseDBData);
};

const Expenses = {
  add,
};

export default Expenses;
