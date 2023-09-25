import { useMemo, useState } from 'react';
import useCards from '../providers/useCards';

const useIncompleteSubscriptions = () => {
  const [incompleteSubscriptions, setIncompleteSubscriptions] = useState(
    /** @type {IncompleteUserSubscription[]} */ ([])
  );
  const { cardsById } = useCards();
  const subscriptions = useMemo(() => {
    /** @type {UserSubscription[]} */
    const subscriptions = incompleteSubscriptions.map(
      (incompleteSubscription) => {
        const { cardId } = incompleteSubscription;
        const card = cardsById[cardId];

        /** @type {UserSubscription} */
        const subscription = {
          ...incompleteSubscription,
          card,
        };

        return subscription;
      }
    );

    return subscriptions;
  }, [incompleteSubscriptions, cardsById]);

  return {
    setIncompleteSubscriptions,
    subscriptions,
  };
};

export default useIncompleteSubscriptions;
