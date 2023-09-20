import { Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
  fixedCostListener,
  monthlyFixedCostsListener,
} from '../firebase/_firestore';
import FirebaseFirestore from '../firebase/firestore';
import useAuthentication from '../providers/useAuthentication';

const CurrentMonthExpense = () => {
  const { authenticatedUserId } = useAuthentication();
  const [currentMonthExpense, setCurrentMonthExpense] = useState(
    /** @type {UserMonthlyExpense | null} */ (null)
  );
  const [fixedCost, setFixedCost] = useState(
    /** @type {FixedCost | null} */ (null)
  );
  const [monthlyFixedCost, setMonthlyFixedCost] = useState(
    /** @type {UserMonthlyFixedCost | null} */ (null)
  );

  const expense = useMemo(() => {
    let cost = 0;

    if (currentMonthExpense) {
      cost += currentMonthExpense.value;
    }

    if (fixedCost) {
      cost += fixedCost.value;
    }

    if (monthlyFixedCost) {
      cost += monthlyFixedCost.value;
    }

    return cost;
  }, [currentMonthExpense, fixedCost, monthlyFixedCost]);

  useEffect(() => {
    const unsubscribeMonthExpenseListener =
      FirebaseFirestore.MonthlyExpenses.listener(
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

    const unsubscribeMonthlyFixedCostListener = monthlyFixedCostsListener(
      authenticatedUserId,
      (monthlyFixedCost) => {
        setMonthlyFixedCost(monthlyFixedCost);
      }
    );

    return () => {
      unsubscribeMonthExpenseListener();
      unsubscribeFixedCostListener();
      unsubscribeMonthlyFixedCostListener();
    };
  }, [authenticatedUserId]);

  return (
    <Grid container direction="column">
      <Grid container item justifyContent="center">
        <Typography variant="h5">{`This month's total expense`}</Typography>
      </Grid>
      <Grid container item justifyContent="center">
        <Typography variant="h6">{`R$ ${expense.toFixed(2)}`}</Typography>
      </Grid>
    </Grid>
  );
};

export default CurrentMonthExpense;
