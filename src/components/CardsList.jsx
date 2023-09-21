import { Grid, List, ListItem, Typography } from '@mui/material';
import useCards from '../providers/useCards';
import AddCardButton from './AddCardButton';

const CardsList = () => {
  const { cards } = useCards();
  const hasAnyCard = cards.length > 0;

  return (
    <List sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
      <ListItem>
        <Grid container alignItems="center">
          <Grid item sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Your cards</Typography>
          </Grid>
          <Grid item>
            <AddCardButton />
          </Grid>
        </Grid>
      </ListItem>
      {hasAnyCard ? (
        <ListItem sx={{ marginTop: 3 }}>
          <Grid container>
            <Grid item sx={{ flexGrow: 1 }}>
              <Typography variant="body1">
                <b>Card name</b>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                <b>Last four digits</b>
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
      ) : null}
      {cards.map((card) => {
        const { id, name, lastFourDigits } = card;

        return (
          <ListItem key={id}>
            <Grid container>
              <Grid item sx={{ flexGrow: 1 }}>
                <Typography variant="body1">{name}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">{lastFourDigits}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CardsList;
