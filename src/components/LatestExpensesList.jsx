import { useContext, useEffect, useState } from 'react';
import { latestExpensesListener } from '../firebase/firestore';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

/** @type {UserExpense[]} */
const defaultLatestExpenses = [];

const LatestExpensesList = () => {
  const { authenticatedUserId } = useContext(AuthenticationContext);

  const [latestExpenses, setLatestExpenses] = useState(defaultLatestExpenses);

  useEffect(() => {
    const unsubscribe = latestExpensesListener(
      authenticatedUserId,
      (latestExpenses) => {
        setLatestExpenses(latestExpenses);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId]);

  return (
    <div>
      {latestExpenses.map((userExpense) => {
        const { id, date, value } = userExpense;

        return (
          <div key={id}>
            <div>{date.toISOString()}</div>
            <div>R${value.toFixed(2)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default LatestExpensesList;
