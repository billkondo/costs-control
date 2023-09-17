import { Grid, List, ListItem, Typography } from '@mui/material';
import AddStoreButton from './AddStoreButton';

const StoresList = () => {
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
    </List>
  );
};

export default StoresList;
