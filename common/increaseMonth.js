/**
 * @param {Month} month
 */
const increaseMonth = (month) => {
  month.month++;

  if (month.month === 12) {
    month.month = 0;
    month.year++;
  }
};

export default increaseMonth;
