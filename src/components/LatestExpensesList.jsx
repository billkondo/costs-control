import { useContext, useEffect, useState } from 'react';
import { latestExpensesListener } from '../firebase/firestore';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

const LatestExpensesList = () => {
  const { authenticatedUserId } = useContext(AuthenticationContext);

  /** @type {[import('../types/expenses').UserExpense[], import('react').SetStateAction<import('../types/expenses').UserExpense[]>]} */
  const [latestExpenses, setLatestExpenses] = useState([]);

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
      {latestExpenses.map((userExpense, index) => {
        const { date, value } = userExpense;

        return (
          <div key={index}>
            <div>{date.toISOString()}</div>
            <div>R${value.toFixed(2)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default LatestExpensesList;
