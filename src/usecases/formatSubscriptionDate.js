import getCurrentMonth from '../utils/date/getCurrentMonth';
import padStart from '../utils/padStart';

/**
 * @param {UserSubscription} subscription
 */
const formatSubscriptionDate = (subscription) => {
  const { day } = subscription;
  const currentMonth = getCurrentMonth() + 1;

  return `${padStart(day)} / ${padStart(currentMonth)}`;
};

export default formatSubscriptionDate;
