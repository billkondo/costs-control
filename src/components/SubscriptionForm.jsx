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
import PropTypes from 'prop-types';
import { useState } from 'react';
import useSubscriptions from '../providers/useSubscriptions';
import FilledDatePicker from './common/FilledDatePicker';
import FilledDayPicker from './common/FilledDayPicker';
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
      value: /** @type {number} */ (value),
      type,
      day: /** @type {number} */ (day),
      month: /** @type {number} */ (month),
      startDate: /** @type {Date} */ (startDate),
      endDate: /** @type {Date} */ (endDate),
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
    <Grid container direction="column" spacing={3}>
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
      <Grid container item spacing={1}>
        <Grid item xs={4}>
          <FilledDayPicker label="Charge day" onDayChange={setDay} />
        </Grid>
        {type === 'YEARLY' ? (
          <Grid item xs={4}>
            <FilledMonthPicker label="Charge month" onMonthChange={setMonth} />
          </Grid>
        ) : null}
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs={4}>
          <FilledDatePicker label="Start date" onChange={setStartDate} />
        </Grid>
        <Grid item xs={4}>
          <FilledDatePicker label="End date" onChange={setEndDate} />
        </Grid>
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
