import { Search } from '@mui/icons-material';
import PropTypes from 'prop-types';
import CardsList from './CardsList';
import DialogButton from './common/DialogButton';

/**
 * @typedef {object} SearchCardButton
 * @property {(card: UserCard) => void} onSelect
 */

/**
 * @param {SearchCardButton} props
 */
const SearchCardButton = (props) => {
  const { onSelect } = props;

  return (
    <DialogButton
      hintText="Search card"
      icon={<Search />}
      renderDialogBody={(closeDialog) => {
        /**
         * @param {UserCard} card
         */
        const onCardSelected = (card) => {
          onSelect(card);
          closeDialog();
        };

        return <CardsList selectable onSelect={onCardSelected} />;
      }}
    />
  );
};

SearchCardButton.propTypes = {
  onSelect: PropTypes.func,
};

export default SearchCardButton;
