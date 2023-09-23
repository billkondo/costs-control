import isImmediateExpense from './isImmediateExpense';

/**
 * @param {Expense} expense
 * @returns {Payment}
 */
const getExpensePayment = (expense) => {
  const { buyDate, value } = expense;
  const buyDay = buyDate.getUTCDate();
  const buyMonth = buyDate.getUTCMonth();
  const buyYear = buyDate.getUTCFullYear();

  if (isImmediateExpense(expense)) {
    return {
      partsCount: 1,
      paymentDates: [
        {
          month: buyMonth,
          year: buyYear,
        },
      ],
      partsValue: value,
      isImmediate: true,
    };
  }

  const { card } = expense;

  if (!card) {
    throw new Error('Expense does not have card');
  }

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
  const partsValue = value / partsTotal;

  /** @type {PaymentDate[]} */
  const dates = [];

  for (let i = 0; i < partsTotal; i++) {
    dates.push({
      month,
      year,
    });

    incrementMonth();
  }

  return {
    partsCount: partsTotal,
    paymentDates: dates,
    partsValue: partsValue,
    isImmediate: false,
  };
};

export default getExpensePayment;
