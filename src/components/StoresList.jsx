import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import useStores from '../providers/useStores';
import useMemoryPagination from '../utils/pagination/useMemoryPagination';
import AddStoreButton from './AddStoreButton';
import ListWithControls from './common/List/ListWithControls';
import TableControl from './common/Table/TableControl';

/**
 * @param {ListWithControlsSelectProps<UserStore>} props
 */
const StoresList = (props) => {
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

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  return (
    <ListWithControls
      {...props}
      title="Stores"
      controls={<AddStoreButton />}
      items={items}
      renderItem={(store) => {
        const { name } = store;

        return (
          <Grid container>
            <Grid item>
              <Typography variant="body1">{name}</Typography>
            </Grid>
          </Grid>
        );
      }}
      bodyHeader={
        <Grid container>
          <Grid item>
            <Typography variant="body1">
              <b>Name</b>
            </Typography>
          </Grid>
        </Grid>
      }
      bodyFooter={
        <TableControl
          startItem={startItem}
          endItem={endItem}
          page={page}
          onBackPage={onBackPage}
          onNextPage={onNextPage}
          inLastPage={inLastPage}
          total={total}
        />
      }
    />
  );
};

StoresList.propTypes = {
  selectable: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default StoresList;
