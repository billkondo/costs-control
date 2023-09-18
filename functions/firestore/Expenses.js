const { Timestamp } = require('firebase-admin/firestore');
const { db } = require('.');

/** @type {Collection<UserExpenseDBData>} */
// @ts-ignore
const collection = db.collection('expenses');

/**
 * @param {UserExpense} expense
 * @returns {string[]}
 */
const getPaymentDates = (expense) => {
  const { paymentType, buyDate } = expense;
  const buyDay = buyDate.getUTCDate();
  const buyMonth = buyDate.getUTCMonth();
  const buyYear = buyDate.getUTCFullYear();
  const isImmediateExpense = paymentType === 'CASH' || paymentType === 'DEBIT';

  /**
   * @param {number} month
   * @param {number} year
   */
  const getDateString = (month, year) => {
    if (month < 10) {
      return `0${month}/${year}`;
    }

    return `${month}/${year}`;
  };

  if (isImmediateExpense) {
    return [getDateString(buyMonth, buyYear)];
  }

  const { card } = expense;
  const { lastBuyDay } = card;
  const { partsCount, isInstallment } = expense;

  let month = buyMonth;
  let year = buyYear;

  const incrementMonth = () => {
    month++;

    if (month === 12) {
      month = 0;
      year++;
    }
  };

  if (buyDay > lastBuyDay) {
    incrementMonth();
  }

  const partsTotal = isInstallment ? partsCount : 1;

  /** @type {string[]} */
  const dates = [];

  for (let i = 0; i < partsTotal; i++) {
    dates.push(getDateString(month, year));

    incrementMonth();
  }

  return dates;
};

/**
 * @param {UserExpense} expense
 */
const add = async (expense) => {
  const { card } = expense;
  const doc = collection.doc();

  /** @type {UserExpenseDBData} */
  const expenseDBData = {
    id: doc.id,
    userId: expense.userId,
    buyDate: Timestamp.fromDate(expense.buyDate),
    storeId: expense.store.id,
    cardId: null,
    isInstallment: expense.isInstallment,
    partsCount: expense.partsCount,
    paymentType: expense.paymentType,
    value: expense.value,
    paymentDates: getPaymentDates(expense),
  };

  if (card) {
    expenseDBData.cardId = card.id;
  }

  await doc.set(expenseDBData);
};

module.exports = {
  add,
};
