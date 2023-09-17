import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Grid, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @typedef {object} TableControlProps
 * @property {number} startItem
 * @property {number} endItem
 * @property {number} total
 * @property {number} page
 * @property {() => void} onBackPage
 * @property {() => void} onNextPage
 * @property {boolean} inLastPage
 */

/**
 * @param {TableControlProps} props
 */
const TableControl = (props) => {
  const {
    startItem,
    endItem,
    total,
    page,
    onBackPage,
    onNextPage,
    inLastPage,
  } = props;

  return (
    <Grid container justifyContent="flex-end" alignItems="center">
      <Grid item sx={{ marginRight: 3 }}>
        <Typography>{`${startItem + 1}-${endItem} of ${total}`}</Typography>
      </Grid>
      <Grid item>
        <IconButton disabled={page === 0} onClick={onBackPage}>
          <ChevronLeft />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton disabled={inLastPage} onClick={onNextPage}>
          <ChevronRight />
        </IconButton>
      </Grid>
    </Grid>
  );
};

TableControl.propTypes = {
  startItem: PropTypes.number,
  endItem: PropTypes.number,
  total: PropTypes.number,
  page: PropTypes.number,
  onBackPage: PropTypes.func,
  onNextPage: PropTypes.func,
  inLastPage: PropTypes.bool,
};

export default TableControl;
