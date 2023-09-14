import { Box, Button } from '@mui/material';
import { useState } from 'react';
import useCards from '../providers/useCards';
import FilledInput from './common/FilledInput';

const CardsForm = () => {
  const { addCard } = useCards();
  const [lastFourDigits, setLastFourDigits] = useState(
    /** @type {number} */ (null)
  );
  const [name, setName] = useState('');
  const [lastBuyDay, setLastBuyDay] = useState(/** @type {number} */ (null));

  const onSubmit = async () => {
    /** @type {Card} */
    const card = {
      name,
      lastBuyDay,
      lastFourDigits,
    };

    await addCard(card);
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
      <FilledInput
        id="card-last-buy-day"
        label="Last buy day"
        onChange={(e) => {
          const newLastBuyDay = parseInt(e.target.value);

          if (!isNaN(newLastBuyDay)) {
            setLastBuyDay(newLastBuyDay);
          } else {
            setLastBuyDay(null);
          }
        }}
      />
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

export default CardsForm;
