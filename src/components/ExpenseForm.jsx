import { Box, Button, Grid, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { ExpensesContext } from '../providers/ExpensesProvider';
import AddCardButton from './AddCardButton';
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

  const onSubmit = async () => {
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

    await addExpense(expense);

    onExpenseSaved();
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
        />
      </Grid>
      <Grid item>
        <FilledDatePicker
          onChange={setBuyDate}
          label="Spent date"
          datePickerProps={{
            disableFuture: true,
          }}
        />
      </Grid>
      <Grid item>
        <StoreSelector store={store} onSelect={setStore} />
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
        />
      </Grid>
      {isCardPayment ? (
        <Grid container item alignItems="center" spacing={1}>
          <Grid item sx={{ flexGrow: 1 }}>
            <CardSelector
              baseId="expense"
              label={isCreditPayment ? 'Credit card' : 'Debit card'}
              onCardSelect={setCard}
              card={card}
            />
          </Grid>
          <Grid item>
            <AddCardButton />
          </Grid>
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
