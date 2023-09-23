import { Chip, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import getExpensePayment from '../../common/getExpensePayment';
import getPaymentPart from '../../common/getPaymentPart';
import getCurrentMonth from '../utils/date/getCurrentMonth';
import getCurrentYear from '../utils/date/getCurrentYear';

/**
 * @typedef {object} ExpensePartChipProps
 * @property {UserExpense} expense
 */

/**
 * @param {ExpensePartChipProps} props
 */
const ExpensePartChip = (props) => {
  const { expense } = props;
  const payment = getExpensePayment(expense);
  const { partsCount, isImmediate } = payment;

  if (isImmediate) {
    return null;
  }

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  const part = getPaymentPart(getCurrentMonth(), getCurrentYear(), payment);
  const isExpenseChargedNextMonth =
    !part && expense.month === currentMonth && expense.year === currentYear;

  if (isExpenseChargedNextMonth) {
    return <Chip label="Charged next month" />;
  }

  return (
    <Tooltip title="Part">
      <Chip label={`${part} / ${partsCount}`} color="primary" />
    </Tooltip>
  );
};

ExpensePartChip.propTypes = {
  expense: PropTypes.object,
};

export default ExpensePartChip;
