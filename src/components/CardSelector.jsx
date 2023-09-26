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
 * @property {string} [errorText]
 */

/**
 * @param {CardSelectorProps} props
 */
const CardSelector = (props) => {
  const { baseId, label, onCardSelect, card, errorText } = props;

  return (
    <Grid container alignItems="flex-start" spacing={1}>
      <Grid item sx={{ flexGrow: 1 }}>
        <FilledInput
          id={`${baseId}-card-selector`}
          label={label}
          readOnly
          value={card?.name ?? ''}
          errorText={errorText}
        />
      </Grid>
      <Grid item sx={{ marginTop: 1.5 }}>
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
  errorText: PropTypes.string,
};

export default CardSelector;
