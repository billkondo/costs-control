import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import SearchCardButton from './SearchCardButton';
import FilledInput from './common/FilledInput';

/**
 * @typedef {object} CardSelectorProps
 * @property {string} baseId
 * @property {string} label
 * @property {(card: UserCard) => void} onCardSelect
 * @property {UserCard | null} card
 */

/**
 * @param {CardSelectorProps} props
 */
const CardSelector = (props) => {
  const { baseId, label, onCardSelect, card } = props;

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item sx={{ flexGrow: 1 }}>
        <FilledInput
          id={`${baseId}-card-selector`}
          label={label}
          readOnly
          value={card?.name ?? ''}
        />
      </Grid>
      <Grid item>
        <SearchCardButton onSelect={onCardSelect} />
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
