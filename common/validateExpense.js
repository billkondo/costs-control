/**
 * @param {Expense} expense
 * @returns {ExpenseError | null}
 */
const validateExpense = (expense) => {
  const {
    value,
    store,
    buyDate,
    card,
    isInstallment,
    paymentType,
    partsCount,
  } = expense;

  /** @type {ExpenseError} */
  const errors = {};

  // @ts-ignore
  const parsedValue = parseFloat(value);

  if (isNaN(parsedValue) || !parsedValue) {
    errors['value'] = 'Invalid expense value';
  }

  if (!store) {
    errors['store'] = 'Select where expense happened';
  }

  if (!buyDate) {
    errors['buyDate'] = 'Select when expense happened';
  }

  if (!paymentType) {
    errors['paymentType'] = 'Select how expense was paid';
  }

  const isCardPayment = paymentType === 'CREDIT' || paymentType === 'DEBIT';

  if (isCardPayment && !card) {
    errors['card'] =
      'Card should not be empty when a card payment type is selected';
  }

  if (paymentType === 'CREDIT' && isInstallment && partsCount <= 1) {
    errors['partsCount'] = 'Installments should have at least two parts';
  }

  if (!Object.keys(errors).length) {
    return null;
  }

  return errors;
};

export default validateExpense;
