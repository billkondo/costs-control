import { Add } from '@mui/icons-material';
import { Grid, List, ListItem, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import useCards from '../providers/useCards';
import CardsForm from './CardsForm';
import DialogButton from './common/DialogButton';

const CardsList = () => {
  const { cards, loadCards } = useCards();
  const hasAnyCard = cards.length > 0;

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return (
    <List sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <ListItem>
        <Grid container alignItems="center">
          <Grid item sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Your cards</Typography>
          </Grid>

          <Tooltip title="Add Card">
            <DialogButton
              dialogTitle="New card"
              icon={<Add />}
              hintText="Add Card"
              dialogBody={<CardsForm />}
            />
          </Tooltip>
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
