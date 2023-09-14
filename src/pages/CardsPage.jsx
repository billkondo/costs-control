import { Grid } from '@mui/material';
import CardsList from '../components/CardsList';

const CardsPage = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={10} md={4}>
        <CardsList />
      </Grid>
    </Grid>
  );
};

export default CardsPage;
