import { useContext } from 'react';
import { ExpensesContext } from '../providers/ExpensesProvider';

const SubscriptionsList = () => {
  const { subscriptions } = useContext(ExpensesContext);

  return (
    <div>
      {subscriptions.map((subscription) => {
        return (
          <div key={subscription.id}>
            {`R$${subscription.value.toFixed(2)}`}
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionsList;
