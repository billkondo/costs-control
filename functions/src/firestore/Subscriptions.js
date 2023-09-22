import { db } from '.';

/** @type {Collection<UserSubscriptionDBData>} */
// @ts-ignore
const collection = db.collection('subscriptions');

/**
 * @param {string} userId
 * @param {Subscription} subscription
 * @returns {Promise<UserSubscription>}
 */
const add = async (userId, subscription) => {
  const doc = collection.doc();

  /** @type {UserSubscriptionDBData} */
  const userSubscriptionDBData = {
    ...subscription,
    id: doc.id,
    userId,
  };

  await doc.set(userSubscriptionDBData);

  return userSubscriptionDBData;
};

const Subscriptions = {
  add,
};

export default Subscriptions;
