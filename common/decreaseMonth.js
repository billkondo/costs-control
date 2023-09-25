/**
 * @param {Month} month
 */
const decreaseMonth = (month) => {
  month.month--;

  if (month.month < 0) {
    month.month = 11;
    month.year--;
  }
};

export default decreaseMonth;
