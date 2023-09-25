import beforeMonth from './beforeMonth';

/**
 * @param {Month} firstMonth
 * @param {Month} secondMonth
 */
const afterMonth = (firstMonth, secondMonth) => {
  return !beforeMonth(firstMonth, secondMonth);
};

export default afterMonth;
