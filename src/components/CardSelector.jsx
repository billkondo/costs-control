import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import useCards from '../providers/useCards';
import FilledSelector from './common/FilledSelector';

/**
 * @typedef {object} CardSelectorProps
 * @property {string} baseId
 * @property {string} label
 * @property {(card: UserCard) => void} onCardSelect
 * @property {UserCard} card
 */

/**
 * @param {CardSelectorProps} props
 */
const CardSelector = (props) => {
  const { baseId, label, onCardSelect, card } = props;
  const { cards, loadCards } = useCards();

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  /**
   * @param {string} cardId
   */
  const onChange = (cardId) => {
    const selectedCard = cards.find((card) => card.id === cardId);

    onCardSelect(selectedCard);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <FilledSelector
          id={`${baseId}-card-selector`}
          items={cards.map((card) => {
            const { id: cardId, name, lastFourDigits } = card;
            const cardLabel = `${name} - ${lastFourDigits}`;

            return {
              label: cardLabel,
              value: cardId,
            };
          })}
          label={label}
          onChange={onChange}
          value={card?.id}
        />
      </Grid>
    </Grid>
  );
};

CardSelector.propTypes = {
  baseId: PropTypes.string,
  label: PropTypes.string,
  onCardSelect: PropTypes.func,
  card: PropTypes.object,
};

export default CardSelector;
