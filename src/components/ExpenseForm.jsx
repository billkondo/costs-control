import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { ExpensesContext } from '../providers/ExpensesProvider';
import FilledDatePicker from './common/FilledDatePicker';
import FilledInput from './common/FilledInput';
import Switch from './common/Switch';

/**
 * @param {{
 *   onExpenseSaved: () => void
 * }} props
 */
const ExpenseForm = (props) => {
  const { onExpenseSaved } = props;
  const { addExpense } = useContext(ExpensesContext);

  const [value, setValue] = useState(/** @type {number} */ (null));
  const [date, setDate] = useState(/** @type {Date} */ (null));
  const [paymentType, setPaymentType] = useState(
    /** @type {PaymentType} */ (null)
  );
  const [installment, setInstallment] = useState(false);
  const [partsCount, setPartsCount] = useState(/** @type {number} */ (null));

  const onSubmit = async () => {
    /** @type {Expense} */
    const expense = {
      value,
      date,
    };

    await addExpense(expense);

    resetForm();
    onExpenseSaved();
  };

  const resetForm = () => {
    setValue(null);
    setDate(null);
  };

  /**
   * @param {PaymentType} paymentType
   */
  const changePaymentType = (paymentType) => {
    setInstallment(false);
    setPartsCount(null);
    setPaymentType(paymentType);
  };

  const isCreditPayment = paymentType === 'CREDIT';

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <FilledInput
          id="expense-value"
          label="Value"
          startAdornment={<InputAdornment position="start">R$</InputAdornment>}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);

            if (!isNaN(newValue)) {
              setValue(newValue);
            } else {
              setValue(null);
            }
          }}
        />
      </Grid>
      <Grid item>
        <FormControl fullWidth variant="filled">
          <InputLabel htmlFor="expense-payment-type" shrink>
            Payment Type
          </InputLabel>
          <Select
            id="expense-payment-type"
            value={paymentType}
            onChange={(event) => {
              const newPaymentType = event.target.value;

              // @ts-ignore
              changePaymentType(newPaymentType);
            }}
            sx={{ paddingTop: 1 }}
          >
            <MenuItem value="CASH">Cash</MenuItem>
            <MenuItem value="DEBIT">Debit</MenuItem>
            <MenuItem value="CREDIT">Credit</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {paymentType ? (
        <Grid item>
          <FilledDatePicker
            datePickerProps={{
              disableFuture: true,
              label: 'Spent date',
              onChange: (newDate) => {
                if (newDate) {
                  setDate(newDate.toDate());
                } else {
                  setDate(null);
                }
              },
            }}
          />
        </Grid>
      ) : null}
      {isCreditPayment ? (
        <Grid item sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ maxWidth: '200px' }}>
            <Switch
              label="Installment?"
              value={installment}
              onChange={(checked) => setInstallment(checked)}
            />
          </Box>

          {installment ? (
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <FilledInput
                  id="expense-parts-count"
                  label="How many parts?"
                  value={partsCount}
                  onChange={(e) => {
                    const newPartsCount = parseInt(e.target.value);

                    if (!newPartsCount) {
                      setPartsCount(null);
                    } else {
                      setPartsCount(newPartsCount);
                    }
                  }}
                />
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      ) : null}
      <Grid item sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          sx={{ textTransform: 'none' }}
        >
          Save expense
        </Button>
      </Grid>
    </Grid>
  );
};

ExpenseForm.propTypes = {
  onExpenseSaved: PropTypes.func,
};

export default ExpenseForm;
