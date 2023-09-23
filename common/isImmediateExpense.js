/**
 * @param {Expense} expense
 */
const isImmediateExpense = (expense) => {
  const { paymentType } = expense;

  return paymentType === 'CASH' || paymentType === 'DEBIT';
};

export default isImmediateExpense;
