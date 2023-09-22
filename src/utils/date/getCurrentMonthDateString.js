import getDateString from '../../../common/getDateString';
import getCurrentMonth from './getCurrentMonth';
import getCurrentYear from './getCurrentYear';

const getCurrentMonthDateString = () => {
  return getDateString(getCurrentMonth(), getCurrentYear());
};

export default getCurrentMonthDateString;
