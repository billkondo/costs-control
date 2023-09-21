import { httpsCallable } from 'firebase/functions';
import { functions } from '..';

/** @type {FunctionCall<AddSubscriptionRequest, AddSubscriptionResponse>} */
const addSubscription = httpsCallable(functions, 'addSubscription');

/**
 * @param {Subscription} subscription
 * @returns {Promise<UserSubscription>}
 */
const add = async (subscription) => {
  const request = await addSubscription(subscription);
  const userSubscription = request.data;

  return userSubscription;
};

export default {
  add,
};
