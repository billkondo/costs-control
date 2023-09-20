import { Card, Grid, List, ListItem, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import { AuthenticationContext } from '../providers/AuthenticationProvider';
import useExpenses from '../providers/useExpenses';
import padStart from '../utils/padStart';
import ViewAllCurrentMonthExpensesButton from './ViewAllCurrentMonthExpensesButton';

const CurrentMonthExpensesList = () => {
  const { currentMonthExpensesCount } = useExpenses();
  const { authenticatedUserId } = useContext(AuthenticationContext);

  const [expenses, setExpenses] = useState(/** @type {UserExpense[]} */ ([]));

  const hasAnyExpense = expenses.length > 0;
  const hasManyExpenses = currentMonthExpensesCount > 5;

  useEffect(() => {
    const unsubscribe = FirebaseFirestore.expenses.currentMonth.listener(
      authenticatedUserId,
      (expenses) => {
        setExpenses(expenses);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId]);

  /**
   * @param {Date} date
   * @returns {string}
   */
  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${padStart(day)} / ${padStart(month)}`;
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h6">{`This month's expenses`}</Typography>
      </Grid>

      <Grid item>
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          <Card variant="outlined">
            {expenses.map((expense) => {
              const { id, buyDate, value } = expense;

              return (
                <ListItem key={id} divider>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Typography variant="body1">
                        <b>{`R$ ${value.toFixed(2)}`}</b>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      style={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Typography variant="body2">
                        {formatDate(buyDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
            {!hasAnyExpense ? (
              <Grid
                container
                direction="column"
                sx={{ p: 3 }}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="body1">
                    <i>There are no expenses</i>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <i>this month</i>
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
            {hasManyExpenses ? (
              <ListItem>
                <Grid container justifyContent="flex-end">
                  <ViewAllCurrentMonthExpensesButton />
                </Grid>
              </ListItem>
            ) : null}
          </Card>
        </List>
      </Grid>
    </Grid>
  );
};

export default CurrentMonthExpensesList;
