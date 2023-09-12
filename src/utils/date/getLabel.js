import dayjs from 'dayjs';

/**
 * @param {Date} date
 */
const getLabel = (date) => {
  const dateObj = dayjs(date);

  return dateObj.format('dddd, DD of MMMM');
};

export default getLabel;
