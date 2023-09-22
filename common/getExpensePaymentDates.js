/**
 * @param {Expense} expense
 * @returns {PaymentDate[]}
 */
const getExpensePaymentDates = (expense) => {
  const { paymentType, buyDate } = expense;
  const buyDay = buyDate.getUTCDate();
  const buyMonth = buyDate.getUTCMonth();
  const buyYear = buyDate.getUTCFullYear();
  const isImmediateExpense = paymentType === 'CASH' || paymentType === 'DEBIT';

  if (isImmediateExpense) {
    return [
      {
        month: buyMonth,
        year: buyYear,
      },
    ];
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

  /** @type {PaymentDate[]} */
  const dates = [];

  for (let i = 0; i < partsTotal; i++) {
    dates.push({
      month,
      year,
    });

    incrementMonth();
  }

  return dates;
};

export default getExpensePaymentDates;
