import padStart from './padStart';

/**
 * @param {Month} monthYear
 * @returns {number}
 */
const getMonthKey = (monthYear) => {
  const { month, year } = monthYear;
  const key = `${year}${padStart(month)}`;

  return parseInt(key);
};

export default getMonthKey;
