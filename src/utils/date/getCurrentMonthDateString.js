import getCurrentMonth from './getCurrentMonth';
import getCurrentYear from './getCurrentYear';
import getDateString from './getDateString';

const getCurrentMonthDateString = () => {
  return getDateString(getCurrentMonth(), getCurrentYear());
};

export default getCurrentMonthDateString;
