import { Box, Typography, colors } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import getLabel from '../utils/date/getLabel';
import PriceText from './PriceText';

/**
 * @typedef {{ [label: string]: UserExpense[]}} GroupedExpenses
 */

/**
 * @param {{
 *  expenses: UserExpense[]
 * }} props
 */
const ExpensesListGroupedByDay = (props) => {
  const { expenses } = props;

  /**
   * @type {{
   *  groupedExpenses: GroupedExpenses,
   *  dates: string[]
   * }}
   */
  const { groupedExpenses, dates } = useMemo(() => {
    /** @type {GroupedExpenses} */
    const groupedExpenses = {};

    /** @type {Date[]} */
    const dates = [];

    for (const expense of expenses) {
      const { buyDate } = expense;
      const label = getLabel(buyDate);

      if (!groupedExpenses[label]) {
        groupedExpenses[label] = [];
      }

      groupedExpenses[label].push(expense);
      dates.push(buyDate);
    }

    dates.sort().reverse();

    return {
      groupedExpenses,
      dates: Array.from(new Set(dates)).map((date) => getLabel(date)),
    };
  }, [expenses]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', paddingBottom: 3 }}>
      {dates.map((label) => {
        const expenses = groupedExpenses[label];

        return (
          <Box key={label} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                backgroundColor: colors.blue[100],
                p: 1,
              }}
            >
              <Typography variant="body1">{label}</Typography>
            </Box>
            {expenses.map((expense) => {
              const { id, value } = expense;

              return (
                <Box
                  key={id}
                  sx={{
                    display: 'flex',
                    p: 1,
                    justifyContent: 'flex-end',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <PriceText value={value} />
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

ExpensesListGroupedByDay.propTypes = {
  expenses: PropTypes.array,
};

export default ExpensesListGroupedByDay;
