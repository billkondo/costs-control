import getCurrentMonth from './getCurrentMonth';
import getCurrentYear from './getCurrentYear';

const getNextMonths = () => {
  const month = getCurrentMonth();
  const year = getCurrentYear();

  let m = month;
  let y = year;

  const incrementMonth = () => {
    m++;

    if (m === 12) {
      m = 0;
      y++;
    }
  };

  incrementMonth();

  /** @type {Month[]} */
  const dates = [];

  for (let i = 0; i < 6; i++) {
    dates.push({
      month: m,
      year: y,
    });

    incrementMonth();
  }

  return dates;
};

export default getNextMonths;
