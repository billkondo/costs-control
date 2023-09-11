import padStart from '../utils/padStart';

/**
 * @param {UserSubscription} subscription
 */
const formatSubscriptionDate = (subscription) => {
  const { day } = subscription;
  const now = new Date();
  const currentMonth = now.getMonth();

  return `${padStart(day)} / ${padStart(currentMonth)}`;
};

export default formatSubscriptionDate;
