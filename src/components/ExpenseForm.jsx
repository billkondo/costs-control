import { LoadingButton } from '@mui/lab';
import { Box, Grid, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import validateExpense from '../../common/validateExpense';
import { ExpensesContext } from '../providers/ExpensesProvider';
import CardSelector from './CardSelector';
import StoreSelector from './StoreSelector';
import FilledDatePicker from './common/FilledDatePicker';
import FilledInput from './common/FilledInput';
import FilledSelector from './common/FilledSelector';
import Switch from './common/Switch';

/**
 * @param {{
 *   onExpenseSaved: () => void
 * }} props
 */
const ExpenseForm = (props) => {
  const { onExpenseSaved } = props;
  const { addExpense } = useContext(ExpensesContext);

  const [value, setValue] = useState(/** @type {number | null} */ (null));
  const [buyDate, setBuyDate] = useState(/** @type {Date | null} */ (null));
  const [paymentType, setPaymentType] = useState(
    /** @type {PaymentType} */ ('')
  );
  const [installment, setInstallment] = useState(false);
  const [partsCount, setPartsCount] = useState(
    /** @type {number | null} */ (null)
  );
  const [card, setCard] = useState(/** @type {UserCard | null} */ (null));
  const [store, setStore] = useState(/** @type {UserStore | null} */ (null));

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(
    /** @type {ExpenseError | null} */ (null)
  );

  const onSubmit = async () => {
    try {
      setLoading(true);

      /** @type {Expense} */
      const expense = {
        value: /** @type {number} */ (value),
        buyDate: /** @type {Date} */ (buyDate),
        store: /** @type {UserStore} */ (store),
        card: /** @type {UserCard} */ (card),
        isInstallment: installment,
        partsCount: /** @type {number} */ (partsCount),
        paymentType,
      };

      const errors = validateExpense(expense);

      if (errors) {
        return setErrors(errors);
      }

      await addExpense(expense);

      onExpenseSaved();
    } finally {
      setLoading(false);
    }
  };

  /**
   * @param {PaymentType} paymentType
   */
  const changePaymentType = (paymentType) => {
    setInstallment(false);
    setPartsCount(null);
    setCard(null);
    setPaymentType(paymentType);
  };

  /**
   * @param {boolean} installment
   */
  const changeInstallment = (installment) => {
    setInstallment(installment);
    setPartsCount(null);
  };

  const isCreditPayment = paymentType === 'CREDIT';
  const isCardPayment = paymentType === 'CREDIT' || paymentType === 'DEBIT';

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
          errorText={errors?.value}
        />
      </Grid>
      <Grid item>
        <FilledDatePicker
          onChange={setBuyDate}
          label="Spent date"
          datePickerProps={{
            disableFuture: true,
          }}
          errorText={errors?.buyDate}
        />
      </Grid>
      <Grid item>
        <StoreSelector
          store={store}
          onSelect={setStore}
          errorText={errors?.store}
        />
      </Grid>
      <Grid item>
        <FilledSelector
          id="expense-payment-type"
          items={[
            {
              label: 'Cash',
              value: 'CASH',
            },
            {
              label: 'Debit',
              value: 'DEBIT',
            },
            {
              label: 'Credit',
              value: 'CREDIT',
            },
          ]}
          label="Payment Type"
          value={paymentType}
          onChange={changePaymentType}
          errorText={errors?.paymentType}
        />
      </Grid>
      {isCardPayment ? (
        <Grid item>
          <CardSelector
            baseId="expense"
            label={isCreditPayment ? 'Credit card' : 'Debit card'}
            onCardSelect={setCard}
            card={card}
            errorText={errors?.card}
          />
        </Grid>
      ) : null}
      {isCreditPayment ? (
        <Grid item sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ maxWidth: '200px' }}>
            <Switch
              label="Installment?"
              value={installment}
              onChange={(checked) => changeInstallment(checked)}
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
                  errorText={errors?.partsCount}
                />
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      ) : null}
      <Grid item sx={{ marginTop: 3 }}>
        <LoadingButton
          variant="contained"
          fullWidth
          onClick={onSubmit}
          loading={loading}
          sx={{ textTransform: 'none' }}
        >
          Save expense
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

ExpenseForm.propTypes = {
  onExpenseSaved: PropTypes.func,
};

export default ExpenseForm;
