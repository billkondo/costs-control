import { Timestamp } from 'firebase-admin/firestore';
import { db } from '.';
import increaseMonth from '../../../common/increaseMonth';
import decreaseMonth from '../../../common/decreaseMonth';

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
  const { card, day, startDate, endDate } = subscription;
  const { lastBuyDay } = card;

  const startMonth = startDate.getMonth();
  const startYear = startDate.getFullYear();

  /** @type {Month} */
  const paymentStart = { month: startMonth, year: startYear };

  if (day <= lastBuyDay) {
    increaseMonth(paymentStart);
  }

  const endDay = endDate ? endDate?.getDate() : null;
  const endMonth = endDate ? endDate.getMonth() : null;
  const endYear = endDate ? endDate.getFullYear() : null;
  const subscriptionEnded = !!endDate;

  /** @type {Month | null} */
  let paymentEnd = null;

  if (subscriptionEnded) {
    paymentEnd = {
      month: /** @type {number} */ (endMonth),
      year: /** @type {number} */ (endYear),
    };

    if (endDay && day > endDay) {
      decreaseMonth(paymentEnd);
    }
  }

  /** @type {ServerUserSubscriptionDBData} */
  const userSubscriptionDBData = {
    id: doc.id,
    userId,
    cardId: card.id,
    day: subscription.day,
    month: subscription.month,
    type: subscription.type,
    value: subscription.value,
    startDate: Timestamp.fromDate(startDate),
    startMonth,
    startYear: startDate.getFullYear(),
    paymentStartMonth: paymentStart.month,
    paymentStartYear: paymentStart.year,
    endDate: subscription.endDate
      ? Timestamp.fromDate(subscription.endDate)
      : null,
    endMonth,
    endYear,
    paymentEndMonth: paymentEnd ? paymentEnd.month : null,
    paymentEndYear: paymentEnd ? paymentEnd.year : null,
  };

  await doc.set(userSubscriptionDBData);

  return {
    ...userSubscriptionDBData,
    card,
    startDate,
    endDate,
  };
};

const Subscriptions = {
  add,
};

export default Subscriptions;
