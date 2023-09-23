import dayjs from 'dayjs';
import getCurrentYear from './getCurrentYear';

/**s
 * @param {MonthlyExpense} monthlyExpense
 */
const getChartLabel = (monthlyExpense) => {
  const { month, year } = monthlyExpense;
  const inCurrentYear = year === getCurrentYear();
  const date = dayjs(new Date(year, month));

  if (inCurrentYear) {
    return date.format('MMM');
  }

  return date.format('MMM/YY');
};

export default getChartLabel;
