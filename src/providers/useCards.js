import { useContext } from 'react';
import { CardsContext } from './CardsProvider';

const useCards = () => {
  return useContext(CardsContext);
};

export default useCards;
