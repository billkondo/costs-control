import padStart from '../padStart';
import getCurrentYear from './getCurrentYear';

/**
 * @param {number} month
 * @param {number} year
 * @returns {Date}
 */
const getFirstDateOfMonth = (month, year) => {
  if (!year) {
    year = getCurrentYear();
  }

  return new Date(`${year}-${padStart(month)}-01`);
};

export default getFirstDateOfMonth;
