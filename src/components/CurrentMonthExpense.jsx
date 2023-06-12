import { useContext, useEffect, useState } from 'react';
import { currentMonthExpenseListener } from '../firebase/firestore';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

/** @type {UserMonthlyExpense | null} */
const defaultCurrentMonthExpense = null;

const CurrentMonthExpense = () => {
  const { authenticatedUserId } = useContext(AuthenticationContext);
  const [currentMonthExpense, setCurrentMonthExpense] = useState(
    defaultCurrentMonthExpense
  );

  useEffect(() => {
    const unsubscribe = currentMonthExpenseListener(
      authenticatedUserId,
      (currentMonthExpense) => {
        setCurrentMonthExpense(currentMonthExpense);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId]);

  return (
    <div>
      {currentMonthExpense ? (
        <div>{`R$${currentMonthExpense.value.toFixed(2)}`}</div>
      ) : null}
    </div>
  );
};

export default CurrentMonthExpense;
