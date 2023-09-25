/**
 * @param {Month} firstMonth
 * @param {Month} secondMonth
 * @returns {boolean}
 */
const beforeMonth = (firstMonth, secondMonth) => {
  if (firstMonth.year === secondMonth.year) {
    return firstMonth.month <= secondMonth.month;
  }

  return firstMonth.year < secondMonth.year;
};

export default beforeMonth;
