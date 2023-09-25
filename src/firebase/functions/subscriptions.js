import { httpsCallable } from 'firebase/functions';
import { functions } from '..';

/** @type {FunctionCall<AddSubscriptionRequest, AddSubscriptionResponse>} */
const addSubscription = httpsCallable(functions, 'addSubscription');

/**
 * @param {Subscription} subscription
 * @returns {Promise<IncompleteUserSubscription>}
 */
const add = async (subscription) => {
  const response = await addSubscription({
    ...subscription,
    startDate: subscription.startDate.toString(),
    endDate: subscription.endDate ? subscription.endDate.toString() : null,
  });
  const subscriptionResponse = response.data;
  const { startDate, endDate } = subscriptionResponse;

  return {
    ...subscriptionResponse,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
  };
};

export default {
  add,
};
