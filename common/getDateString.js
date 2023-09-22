import padStart from './padStart';

/**
 * @param {number} month
 * @param {number} year
 * @returns {string}
 */
const getDateString = (month, year) => {
  return `${padStart(month)}/${year}`;
};

export default getDateString;
