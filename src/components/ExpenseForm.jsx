import {
  Button,
  FilledInput,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { ExpensesContext } from '../providers/ExpensesProvider';

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

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <FormControl fullWidth variant="filled">
          <InputLabel htmlFor="expense-value">Value</InputLabel>
          <FilledInput
            id="expense-value"
            name="value"
            startAdornment={
              <InputAdornment position="start">R$</InputAdornment>
            }
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);

              if (!isNaN(newValue)) {
                setValue(newValue);
              } else {
                setValue(null);
              }
            }}
          />
        </FormControl>
      </Grid>
      <Grid item>
        <DatePicker
          label="Date"
          onChange={(newDate) => {
            if (newDate) {
              setDate(newDate.toDate());
            } else {
              setDate(null);
            }
          }}
          slotProps={{
            textField: {
              variant: 'filled',
              fullWidth: true,
              name: 'date',
              InputLabelProps: { shrink: true },
            },
          }}
        />
      </Grid>
      <Grid item sx={{ marginTop: 3 }}>
        <Button variant="contained" fullWidth onClick={onSubmit}>
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
