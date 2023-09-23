import getCurrentMonth from './getCurrentMonth';
import getCurrentYear from './getCurrentYear';

const getLatestMonths = () => {
  const month = getCurrentMonth();
  const year = getCurrentYear();

  /** @type {{ month: number; year: number }[]} */
  const dates = [];

  let m = month;
  let y = year;

  for (let i = 0; i < 6; i++) {
    dates.push({
      month: m,
      year: y,
    });

    m--;

    if (m < 0) {
      y--;
      m = 1;
    }
  }

  return dates.reverse();
};

export default getLatestMonths;
