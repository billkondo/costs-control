import { useContext, useEffect, useMemo, useState } from 'react';
import {
  currentMonthExpenseListener,
  fixedCostListener,
} from '../firebase/firestore';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

const CurrentMonthExpense = () => {
  const { authenticatedUserId } = useContext(AuthenticationContext);
  const [currentMonthExpense, setCurrentMonthExpense] = useState(
    /** @type {UserMonthlyExpense} */ (null)
  );
  const [fixedCost, setFixedCost] = useState(/** @type {FixedCost} */ (null));

  const expense = useMemo(() => {
    let cost = 0;

    if (currentMonthExpense) {
      cost += currentMonthExpense.value;
    }

    if (fixedCost) {
      cost += fixedCost.value;
    }

    return cost;
  }, [currentMonthExpense, fixedCost]);

  useEffect(() => {
    const unsubscribeMonthExpenseListener = currentMonthExpenseListener(
      authenticatedUserId,
      (currentMonthExpense) => {
        setCurrentMonthExpense(currentMonthExpense);
      }
    );

    const unsubscribeFixedCostListener = fixedCostListener(
      authenticatedUserId,
      (fixedCost) => {
        setFixedCost(fixedCost);
      }
    );

    return () => {
      unsubscribeMonthExpenseListener();
      unsubscribeFixedCostListener();
    };
  }, [authenticatedUserId]);

  return (
    <div>
      <div>{`Current month cost: R$${expense.toFixed(2)}`}</div>
    </div>
  );
};

export default CurrentMonthExpense;
