import { httpsCallable } from 'firebase/functions';
import { functions } from '..';

/** @type {FunctionCall<AddSubscriptionRequest, void>} */
const addSubscription = httpsCallable(functions, 'addSubscription');

/**
 * @param {Subscription} subscription
 * @returns {Promise<void>}
 */
const add = async (subscription) => {
  await addSubscription({
    ...subscription,
    startDate: subscription.startDate.toString(),
    endDate: subscription.endDate ? subscription.endDate.toString() : null,
  });
};

export default {
  add,
};
