import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import Pager from '../firebase/firestore/Pager';
import {
  getUserStoresBaseQuery,
  getUserStoresTotal,
} from '../firebase/firestore/stores';
import useAuthentication from '../providers/useAuthentication';
import AddStoreButton from './AddStoreButton';
import TableControl from './common/Table/TableControl';
import useTable from './common/Table/useTable';

const useStoresTable = () => {
  const { authenticatedUserId } = useAuthentication();
  const [total, setTotal] = useState(0);

  const pager = useMemo(() => {
    return Pager(authenticatedUserId, getUserStoresBaseQuery);
  }, [authenticatedUserId]);

  useEffect(() => {
    const load = async () => {
      const newTotal = await getUserStoresTotal(authenticatedUserId);

      setTotal(newTotal);
    };

    load();
  }, [authenticatedUserId]);

  return {
    ...useTable({
      total,
      getItems: pager,
    }),
    total,
  };
};

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
  const {
    startItem,
    endItem,
    page,
    onBackPage,
    onNextPage,
    inLastPage,
    items,
    total,
  } = useStoresTable();
  const hasAnyStore = total > 0;

  const ItemComponent = selectable ? ListItemButton : ListItem;

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
            const { id, name } = item;

            return (
              <ItemComponent
                key={id}
                onClick={() => {
                  if (!selectable) {
                    return;
                  }

                  onSelect(item);
                }}
              >
                <Grid container>
                  <Grid item>
                    <Typography variant="body1">{name}</Typography>
                  </Grid>
                </Grid>
              </ItemComponent>
            );
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
