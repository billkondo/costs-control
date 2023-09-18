import { Storefront } from '@mui/icons-material';
import { Grid, Icon, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import SearchStoreButton from './SearchStoreButton';
import FilledInput from './common/FilledInput';

/**
 * @typedef {object} StoreSelectorProps
 * @property {UserStore} store
 * @property {(store: UserStore) => void} onSelect
 */

/**
 * @param {StoreSelectorProps} props
 */
const StoreSelector = (props) => {
  const { store, onSelect } = props;

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item sx={{ flexGrow: 1 }}>
        <FilledInput
          id="store-selector"
          label="Store"
          value={store?.name}
          readOnly
          startAdornment={
            <InputAdornment position="start">
              <Icon>
                <Storefront />
              </Icon>
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item>
        <SearchStoreButton onSelect={onSelect} />
      </Grid>
    </Grid>
  );
};

StoreSelector.propTypes = {
  store: PropTypes.object,
  onSelect: PropTypes.func,
};

export default StoreSelector;
