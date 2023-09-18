import { Search } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import useStores from '../providers/useStores';
import StoresList from './StoresList';
import DialogButton from './common/DialogButton';

/**
 * @typedef {object} SearchStoreButton
 * @property {(store: UserStore) => void} onSelect
 */

/**
 * @param {SearchStoreButton} props
 */
const SearchStoreButton = (props) => {
  const { onSelect } = props;
  const { loadStores } = useStores();

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  return (
    <DialogButton
      hintText="Search store"
      icon={<Search />}
      renderDialogBody={(closeDialog) => {
        /**
         * @param {UserStore} store
         */
        const onStoreSelected = (store) => {
          onSelect(store);
          closeDialog();
        };

        return <StoresList selectable onSelect={onStoreSelected} />;
      }}
    />
  );
};

SearchStoreButton.propTypes = {
  onSelect: PropTypes.func,
};

export default SearchStoreButton;
