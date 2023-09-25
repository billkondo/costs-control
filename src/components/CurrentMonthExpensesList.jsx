import { Card, Grid, List, ListItem, Typography } from '@mui/material';
import { useEffect } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import useAuthentication from '../providers/useAuthentication';
import useExpenses from '../providers/useExpenses';
import useIncompleteExpenses from '../usecases/useIncompleteExpenses';
import ExpensesListItems from './ExpensesListItems';
import ViewAllCurrentMonthExpensesButton from './ViewAllCurrentMonthExpensesButton';

const CurrentMonthExpensesList = () => {
  const { currentMonthExpensesCount } = useExpenses();
  const { authenticatedUserId } = useAuthentication();
  const { expenses, setIncompleteExpenses } = useIncompleteExpenses();

  const hasAnyExpense = expenses.length > 0;
  const hasManyExpenses = currentMonthExpensesCount > 5;

  useEffect(() => {
    const unsubscribe = FirebaseFirestore.expenses.currentMonth.listener(
      authenticatedUserId,
      (incompleteExpenses) => {
        setIncompleteExpenses(incompleteExpenses);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId, setIncompleteExpenses]);

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
            <ExpensesListItems expenses={expenses} />
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
