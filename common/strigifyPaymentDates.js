import getDateString from './getDateString';

/**
 * @param {PaymentDate[]} paymentDates
 * @returns {string[]}
 */
const stringifyPaymentDates = (paymentDates) => {
  return paymentDates.map((paymentDate) => {
    const { month, year } = paymentDate;

    return getDateString(month, year);
  });
};

export default stringifyPaymentDates;
