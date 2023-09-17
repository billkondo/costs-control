import { Grid } from '@mui/material';
import StoresList from '../components/StoresList';

const StoresPage = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={10} md={4}>
        <StoresList />
      </Grid>
    </Grid>
  );
};

export default StoresPage;
