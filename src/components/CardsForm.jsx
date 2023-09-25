import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
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

  const onSubmit = async () => {
    /** @type {Card} */
    const card = {
      name,
      lastBuyDay: /** @type {number} */ (lastBuyDay),
      lastFourDigits: /** @type {number} */ (lastFourDigits),
    };

    await addCard(card);

    if (onSubmitted) {
      onSubmitted();
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
      />
      <FilledDayPicker label="Last buy day" onDayChange={setLastBuyDay} />
      <FilledInput
        id="card-name"
        label="Name"
        onChange={(e) => {
          const newName = e.target.value;

          setName(newName);
        }}
      />
      <Button
        onClick={onSubmit}
        variant="contained"
        sx={{ textTransform: 'none', marginTop: 3 }}
      >
        Save card
      </Button>
    </Box>
  );
};

CardsForm.propTypes = {
  onSubmitted: PropTypes.func,
};

export default CardsForm;
