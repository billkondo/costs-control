import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @template {withID} T
 * @param {ListWithControlsProps<T>} props
 */
const ListWithControls = (props) => {
  const {
    controls,
    items = [],
    title = '',
    selectable = false,
    onSelect,
    renderItem = () => <></>,
    bodyHeader,
    bodyFooter,
  } = props;
  const hasAnyItem = items.length > 0;

  /**
   * @param {T} item
   * @returns {React.ReactElement}
   */
  const _renderItem = (item) => {
    const { id } = item;

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

    const common = renderItem(item);

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
            <Typography variant="h6">{title}</Typography>
          </Grid>
          <Grid item>{controls}</Grid>
        </Grid>
      </ListItem>
      {hasAnyItem ? (
        <>
          {bodyHeader ? (
            <ListItem sx={{ marginTop: 3 }}>{bodyHeader}</ListItem>
          ) : null}
          {items.map((item) => {
            return _renderItem(item);
          })}
          {bodyFooter ? <ListItem>{bodyFooter}</ListItem> : null}
        </>
      ) : null}
    </List>
  );
};

ListWithControls.propTypes = {
  controls: PropTypes.node,
  title: PropTypes.string,
  items: PropTypes.array,
  selectable: PropTypes.bool,
  onSelect: PropTypes.func,
  renderItem: PropTypes.func,
  bodyHeader: PropTypes.node,
  bodyFooter: PropTypes.node,
};

export default ListWithControls;
