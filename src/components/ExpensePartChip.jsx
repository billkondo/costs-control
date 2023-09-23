import { Chip } from '@mui/material';
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
  const { partsCount, isInstallment } = payment;

  if (!isInstallment) {
    return null;
  }

  const part = getPaymentPart(getCurrentMonth(), getCurrentYear(), payment);

  return <Chip label={`${part} / ${partsCount}`} color="primary" />;
};

ExpensePartChip.propTypes = {
  expense: PropTypes.object,
};

export default ExpensePartChip;
