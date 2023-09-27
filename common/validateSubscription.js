/**
 * @param {Subscription} subscription
 * @returns {SubscriptionError | null}
 */
const validateSubscription = (subscription) => {
  const { card, day, month, startDate, type, value } = subscription;

  /** @type {SubscriptionError} */
  const errors = {};

  if (isNaN(value) || !value) {
    errors['value'] = 'Invalid subscription value';
  }

  if (!startDate) {
    errors['startDate'] = 'Select when then subscription started';
  }

  if (isNaN(day) || !day) {
    errors['day'] = 'Select the day when the subscription is charged';
  }

  if (type === 'YEARLY' && (!isNaN(month) || !month)) {
    errors['month'] = 'Select the month when then subscription is charged';
  }

  if (!card) {
    errors['card'] = 'Select the card that is charged by the subscription';
  }

  if (!Object.keys(errors).length) {
    return null;
  }

  return errors;
};

export default validateSubscription;
