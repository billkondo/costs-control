import { Grid, ListItem, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import padStart from '../../common/padStart';
import ExpensePartChip from './ExpensePartChip';
import PriceText from './PriceText';

/**
 * @typedef {object} ExpensesListItemsProps
 * @property {UserExpense[]} expenses
 */

/**
 * @param {ExpensesListItemsProps} props
 */
const ExpensesListItems = (props) => {
  const { expenses } = props;

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
    <>
      {expenses.map((expense) => {
        const { id, buyDate, value } = expense;

        return (
          <ListItem key={id} divider sx={{ height: 50 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item sx={{ flexGrow: 1 }}>
                <PriceText value={value} />
              </Grid>
              <Grid item>
                <ExpensePartChip expense={expense} />
              </Grid>
              <Grid item>
                <Tooltip title="Buy date">
                  <Typography variant="body2">{formatDate(buyDate)}</Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </ListItem>
        );
      })}
    </>
  );
};

ExpensesListItems.propTypes = {
  expenses: PropTypes.array,
};

export default ExpensesListItems;
