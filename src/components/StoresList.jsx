import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import useStores from '../providers/useStores';
import useMemoryPagination from '../utils/pagination/useMemoryPagination';
import AddStoreButton from './AddStoreButton';
import TableControl from './common/Table/TableControl';

/**
 * @typedef {object} StoresListProps
 * @property {boolean} [selectable]
 * @property {(store: UserStore) => void} [onSelect]
 */

/**
 * @param {StoresListProps} props
 */

const StoresList = (props) => {
  const { selectable, onSelect } = props;
  const { stores, loadStores } = useStores();
  const {
    startItem,
    endItem,
    page,
    onBackPage,
    onNextPage,
    inLastPage,
    items,
    total,
  } = useMemoryPagination({
    items: stores,
  });
  const hasAnyStore = total > 0;

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  /**
   * @param {UserStore} item
   * @returns {React.ReactElement}
   */
  const renderItem = (item) => {
    const { id, name } = item;

    const props = {
      key: id,
      onClick: () => {
        if (!selectable) {
          return;
        }

        if (onSelect) {
          onSelect(item);
        }
      },
    };

    const common = (
      <Grid container>
        <Grid item>
          <Typography variant="body1">{name}</Typography>
        </Grid>
      </Grid>
    );

    if (selectable) {
      return <ListItemButton {...props}>{common}</ListItemButton>;
    }

    return <ListItem {...props}>{common}</ListItem>;
  };

  return (
    <List sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
      <ListItem>
        <Grid container>
          <Grid item sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Registered stores</Typography>
          </Grid>
          <Grid item>
            <AddStoreButton />
          </Grid>
        </Grid>
      </ListItem>
      {hasAnyStore ? (
        <>
          <ListItem sx={{ marginTop: 3 }}>
            <Grid container>
              <Grid item>
                <Typography variant="body1">
                  <b>Name</b>
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          {items.map((item) => {
            return renderItem(item);
          })}
          <ListItem>
            <TableControl
              startItem={startItem}
              endItem={endItem}
              page={page}
              onBackPage={onBackPage}
              onNextPage={onNextPage}
              inLastPage={inLastPage}
              total={total}
            />
          </ListItem>
        </>
      ) : null}
    </List>
  );
};

StoresList.propTypes = {
  selectable: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default StoresList;
