import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import validateCard from '../../common/validateCard';
import useCards from '../providers/useCards';
import FilledDayPicker from './common/FilledDayPicker';
import FilledInput from './common/FilledInput';

/**
 * @typedef {object} CardFormProps
 * @property {() => void} [onSubmitted]
 */

/**
 * @param {CardFormProps} props
 */
const CardsForm = (props) => {
  const { onSubmitted } = props;
  const { addCard } = useCards();
  const [lastFourDigits, setLastFourDigits] = useState(
    /** @type {number | null} */ (null)
  );
  const [name, setName] = useState('');
  const [lastBuyDay, setLastBuyDay] = useState(
    /** @type {number | null} */ (null)
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(/** @type {CardError | null} */ (null));

  const onSubmit = async () => {
    try {
      setLoading(true);

      /** @type {Card} */
      const card = {
        name,
        lastBuyDay: /** @type {number} */ (lastBuyDay),
        lastFourDigits: /** @type {number} */ (lastFourDigits),
      };

      const errors = validateCard(card);

      if (errors) {
        return setErrors(errors);
      }

      await addCard(card);

      if (onSubmitted) {
        onSubmitted();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FilledInput
        id="card-last-four-digits"
        label="Last four digits"
        onChange={(e) => {
          const newLastFourDigits = parseInt(e.target.value);

          if (!isNaN(newLastFourDigits)) {
            setLastFourDigits(newLastFourDigits);
          } else {
            setLastFourDigits(null);
          }
        }}
        errorText={errors?.lastFourDigits}
      />
      <FilledDayPicker
        label="Last buy day"
        onDayChange={setLastBuyDay}
        errorText={errors?.lastBuyDay}
      />
      <FilledInput
        id="card-name"
        label="Name"
        onChange={(e) => {
          const newName = e.target.value;

          setName(newName);
        }}
        errorText={errors?.name}
      />
      <LoadingButton
        onClick={onSubmit}
        variant="contained"
        loading={loading}
        sx={{ textTransform: 'none', marginTop: 3 }}
      >
        Save card
      </LoadingButton>
    </Box>
  );
};

CardsForm.propTypes = {
  onSubmitted: PropTypes.func,
};

export default CardsForm;
