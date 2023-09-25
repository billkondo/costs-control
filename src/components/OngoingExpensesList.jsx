import { Card, Grid, List, Typography } from '@mui/material';
import useOngoingExpensesPagination from '../usecases/useOngoingExpensesPagination';
import ExpensesListItems from './ExpensesListItems';

const OngoingExpensesList = () => {
  const { items, total } = useOngoingExpensesPagination();
  const hasAnyOngoingExpense = total > 0;

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h6">Ongoing expenses</Typography>
      </Grid>
      <Grid item>
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          <Card variant="outlined">
            <ExpensesListItems expenses={items} />
            {!hasAnyOngoingExpense ? (
              <Grid
                container
                direction="column"
                sx={{ p: 3 }}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="body1">
                    <i>There are no ongoing</i>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <i>expenses</i>
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
          </Card>
        </List>
      </Grid>
    </Grid>
  );
};

export default OngoingExpensesList;
