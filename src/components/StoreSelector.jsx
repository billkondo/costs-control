import { Storefront } from '@mui/icons-material';
import { Grid, Icon, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import SearchStoreButton from './SearchStoreButton';
import FilledInput from './common/FilledInput';

/**
 * @typedef {object} StoreSelectorProps
 * @property {UserStore | null} store
 * @property {(store: UserStore) => void} onSelect
 * @property {string} [errorText]
 */

/**
 * @param {StoreSelectorProps} props
 */
const StoreSelector = (props) => {
  const { store, onSelect, errorText = '' } = props;

  return (
    <Grid container alignItems="flex-start" spacing={1}>
      <Grid item sx={{ flexGrow: 1 }}>
        <FilledInput
          id="store-selector"
          label="Store"
          value={store?.name ?? ''}
          readOnly
          startAdornment={
            <InputAdornment position="start">
              <Icon>
                <Storefront />
              </Icon>
            </InputAdornment>
          }
          errorText={errorText}
        />
      </Grid>
      <Grid item sx={{ marginTop: 1.5 }}>
        <SearchStoreButton onSelect={onSelect} />
      </Grid>
    </Grid>
  );
};

StoreSelector.propTypes = {
  store: PropTypes.object,
  onSelect: PropTypes.func,
  errorText: PropTypes.string,
};

export default StoreSelector;
