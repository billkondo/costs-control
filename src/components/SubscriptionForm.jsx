import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import validateSubscription from '../../common/validateSubscription';
import useSubscriptions from '../providers/useSubscriptions';
import CardSelector from './CardSelector';
import FilledDatePicker from './common/FilledDatePicker';
import FilledDayPicker from './common/FilledDayPicker';
import FilledInput from './common/FilledInput';
import FilledMonthPicker from './common/FilledMonthPicker';

/**
 * @param {{
 *  onSubscriptionSaved: () => void
 * }} props
 * @returns
 */
const SubscriptionForm = (props) => {
  const { onSubscriptionSaved } = props;
  const { addSubscription } = useSubscriptions();

  const [value, setValue] = useState(/** @type {number | null} */ (null));
  const [type, setType] = useState(/** @type {SubscriptionType} */ ('MONTHLY'));
  const [day, setDay] = useState(/** @type {number | null} */ (null));
  const [month, setMonth] = useState(/** @type {number | null} */ (null));
  const [startDate, setStartDate] = useState(/** @type {Date | null} */ (null));
  const [endDate, setEndDate] = useState(/** @type {Date | null} */ (null));
  const [card, setCard] = useState(/** @type {UserCard | null} */ (null));

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(
    /** @type {SubscriptionError | null} */ (null)
  );

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
    try {
      setLoading(true);

      /** @type {Subscription} */
      const subscription = {
        value: /** @type {number} */ (value),
        type,
        day: /** @type {number} */ (day),
        month: /** @type {number} */ (month),
        startDate: /** @type {Date} */ (startDate),
        endDate: /** @type {Date} */ (endDate),
        card: /** @type {UserCard} */ (card),
      };

      const errors = validateSubscription(subscription);

      if (errors) {
        return setErrors(errors);
      }

      await addSubscription(subscription);

      resetForm();
      onSubscriptionSaved();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setValue(null);
    setType('MONTHLY');
    setDay(null);
    setMonth(null);
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <FilledInput
          id="subscription-value"
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
      <Grid container item spacing={1}>
        <Grid item xs={4}>
          <FilledDayPicker
            label="Charge day"
            onDayChange={setDay}
            errorText={errors?.day}
          />
        </Grid>
        {type === 'YEARLY' ? (
          <Grid item xs={4}>
            <FilledMonthPicker
              label="Charge month"
              onMonthChange={setMonth}
              errorText={errors?.month}
            />
          </Grid>
        ) : null}
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs={4}>
          <FilledDatePicker
            label="Start date"
            onChange={setStartDate}
            errorText={errors?.startDate}
          />
        </Grid>
        <Grid item xs={4}>
          <FilledDatePicker label="End date" onChange={setEndDate} />
        </Grid>
      </Grid>
      <Grid item>
        <CardSelector
          label="Credit card"
          baseId="subscription"
          card={card}
          onCardSelect={setCard}
          errorText={errors?.card}
        />
      </Grid>
      <Grid item sx={{ marginTop: 3 }}>
        <LoadingButton
          variant="contained"
          fullWidth
          onClick={onSubmit}
          loading={loading}
          sx={{ textTransform: 'none' }}
        >
          Save subscription
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

SubscriptionForm.propTypes = {
  onSubscriptionSaved: PropTypes.func,
};

export default SubscriptionForm;
