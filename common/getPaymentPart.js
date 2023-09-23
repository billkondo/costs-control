/**
 * @param {number} month
 * @param {number} year
 * @param {Payment} payment
 * @returns {number}
 */
const getPaymentPart = (month, year, payment) => {
  const { paymentDates } = payment;
  const matchedPaymentDateIndex = paymentDates.findIndex((paymentDate) => {
    const { month: paymentDateMonth, year: paymentDateYear } = paymentDate;

    return month === paymentDateMonth && year === paymentDateYear;
  });

  return matchedPaymentDateIndex + 1;
};

export default getPaymentPart;
