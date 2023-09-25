import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import afterMonth from '../../common/afterMonth';
import beforeMonth from '../../common/beforeMonth';
import getCurrentMonth from '../../common/getCurrentMonth';
import getDateString from '../../common/getDateString';
import increaseMonth from '../../common/increaseMonth';
import FirebaseFirestore from '../firebase/firestore';
import FirebaseFunctions from '../firebase/functions';
import useIncompleteSubscriptions from '../usecases/useIncompleteSubscriptions';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} SubscriptionsState
 * @property {number} currentMonthSubscriptionsCount
 * @property {(subscription: Subscription) => Promise<void>} addSubscription
 * @property {UserSubscription[]} subscriptions
 * @property {(month: Month) => number} getMonthSubscriptionCost
 */

/** @type {SubscriptionsState} */
const defaultSubscriptionsState = {
  currentMonthSubscriptionsCount: 0,
  addSubscription: async () => {},
  subscriptions: [],
  getMonthSubscriptionCost: () => 0,
};

export const SubscriptionsContext = createContext(defaultSubscriptionsState);

/**
 * @param {import('react').PropsWithChildren} props
 */
const SubscriptionsProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useAuthentication();
  const [currentMonthSubscriptionsCount, setCurrentMonthSubscriptionsCount] =
    useState(0);

  const { subscriptions, setIncompleteSubscriptions: setSubscriptions } =
    useIncompleteSubscriptions();

  const loadCurrentMonthSubscriptionsLength = useCallback(async () => {
    const count = await FirebaseFirestore.Subscriptions.currentMonth.count(
      authenticatedUserId
    );

    setCurrentMonthSubscriptionsCount(count);
  }, [authenticatedUserId]);

  useEffect(() => {
    loadCurrentMonthSubscriptionsLength();
  }, [loadCurrentMonthSubscriptionsLength]);

  useEffect(() => {
    const loadAll = async () => {
      const incompleteSubscriptions =
        await FirebaseFirestore.Subscriptions.getAll(authenticatedUserId);

      setSubscriptions(incompleteSubscriptions);
    };

    loadAll();
  }, [authenticatedUserId, setSubscriptions]);

  const { subscriptionCostByMonth, fixedSubscriptionCost } = useMemo(() => {
    /** @type {{ [dateString: string]: number }} */
    const subscriptionCostByMonth = {};

    let fixedSubscriptionCost = 0;

    for (const subscription of subscriptions) {
      const {
        paymentStartMonth,
        paymentStartYear,
        value,
        endDate,
        paymentEndMonth,
        paymentEndYear,
      } = subscription;

      /** @type {Month} */
      const month = { month: paymentStartMonth, year: paymentStartYear };

      /** @type {Month | null} */
      const endMonth = endDate
        ? {
            month: /** @type {number} */ (paymentEndMonth),
            year: /** @type {number} */ (paymentEndYear),
          }
        : null;

      const lastMonth = endMonth ?? getCurrentMonth();

      while (beforeMonth(month, lastMonth)) {
        const dateString = getDateString(month.month, month.year);

        if (!subscriptionCostByMonth[dateString]) {
          subscriptionCostByMonth[dateString] = 0;
        }

        subscriptionCostByMonth[dateString] += value;

        increaseMonth(month);
      }

      const onGoingSubscription = !endDate;

      if (onGoingSubscription) {
        fixedSubscriptionCost += value;
      }
    }

    return { subscriptionCostByMonth, fixedSubscriptionCost };
  }, [subscriptions]);

  const getMonthSubscriptionCost = useCallback(
    /**
     * @param {Month} month
     * @returns {number}
     */
    (month) => {
      const dateString = getDateString(month.month, month.year);
      let cost = subscriptionCostByMonth[dateString] ?? 0;

      if (afterMonth(month, getCurrentMonth())) {
        cost += fixedSubscriptionCost;
      }

      return cost;
    },
    [subscriptionCostByMonth, fixedSubscriptionCost]
  );

  /**
   * @param {Subscription} subscription
   */
  const addSubscription = async (subscription) => {
    const createdSubscription = await FirebaseFunctions.subscriptions.add(
      subscription
    );

    await loadCurrentMonthSubscriptionsLength();

    setSubscriptions((subscriptions) =>
      subscriptions.concat([createdSubscription])
    );
  };

  return (
    <SubscriptionsContext.Provider
      value={{
        currentMonthSubscriptionsCount,
        addSubscription,
        subscriptions,
        getMonthSubscriptionCost,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
};

SubscriptionsProvider.propTypes = {
  children: PropTypes.node,
};

export default SubscriptionsProvider;
