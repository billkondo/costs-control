import {
  Box,
  Button,
  FilledInput,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { ExpensesContext } from '../providers/ExpensesProvider';

/**
 * @param {{
 *  onSubscriptionSaved: () => void
 * }} props
 * @returns
 */
const SubscriptionForm = (props) => {
  const { onSubscriptionSaved } = props;
  const { addSubscription } = useContext(ExpensesContext);

  const [value, setValue] = useState(/** @type {number} */ (null));
  const [type, setType] = useState(/** @type {SubscriptionType} */ ('MONTHLY'));
  const [day, setDay] = useState(/** @type {number} */ (null));
  const [month, setMonth] = useState(/** @type {number} */ (null));

  /**
   * @param {SubscriptionType} newType
   */
  const onTypeChange = (newType) => {
    if (newType === 'MONTHLY') {
      setMonth(null);
    }

    setType(newType);
  };

  const onSubmit = async () => {
    /** @type {Subscription} */
    const subscription = {
      value: isNaN(value) ? null : value,
      type,
      day: isNaN(day) ? null : day,
      month: isNaN(month) ? null : month,
    };

    await addSubscription(subscription);

    resetForm();
    onSubscriptionSaved();
  };

  const resetForm = () => {
    setValue(null);
    setType('MONTHLY');
    setDay(null);
    setMonth(null);
  };

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <FormControl fullWidth variant="filled">
          <InputLabel htmlFor="subscription-value">Value</InputLabel>
          <FilledInput
            id="subscription-value"
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
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Charge frequency
          </Typography>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, newType) => {
              onTypeChange(newType);
            }}
          >
            <ToggleButton value="MONTHLY" sx={{ textTransform: 'none' }}>
              <Typography variant="body1">Monthly</Typography>
            </ToggleButton>
            <ToggleButton value="YEARLY" sx={{ textTransform: 'none' }}>
              <Typography variant="body1">Yearly</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>
      <Grid item>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <DatePicker
            views={['day']}
            disableOpenPicker
            label="Charge day"
            onChange={(date) => {
              if (date) {
                /** @type {Date} */
                const dateObj = date.toDate();
                const newDay = dateObj.getDate();

                setDay(newDay);
              } else {
                setDay(null);
              }
            }}
            slotProps={{
              textField: {
                variant: 'filled',
                InputLabelProps: { shrink: true },
              },
            }}
          />
          {type === 'YEARLY' ? (
            <DatePicker
              views={['month']}
              view="month"
              label="Charge month"
              openTo="month"
              onChange={(date) => {
                if (date) {
                  /** @type {Date} */
                  const dateObj = date.toDate();
                  const newMonth = dateObj.getMonth();

                  setMonth(newMonth + 1);
                } else {
                  setMonth(null);
                }
              }}
              slotProps={{
                textField: {
                  variant: 'filled',
                  InputLabelProps: { shrink: true },
                },
              }}
            />
          ) : null}
        </Box>
      </Grid>
      <Grid item sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          sx={{ textTransform: 'none' }}
        >
          Save subscription
        </Button>
      </Grid>
    </Grid>
  );
};

SubscriptionForm.propTypes = {
  onSubscriptionSaved: PropTypes.func,
};

export default SubscriptionForm;
