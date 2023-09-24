import { Timestamp } from 'firebase-admin/firestore';
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

  /** @type {UserSubscription} */
  const userSubscription = {
    ...subscription,
    id: doc.id,
    userId,
  };

  /** @type {ServerUserSubscriptionDBData} */
  const userSubscriptionDBData = {
    ...userSubscription,
    startDate: Timestamp.fromDate(subscription.startDate),
    endDate: subscription.endDate
      ? Timestamp.fromDate(subscription.endDate)
      : null,
  };

  await doc.set(userSubscriptionDBData);

  return userSubscription;
};

const Subscriptions = {
  add,
};

export default Subscriptions;
