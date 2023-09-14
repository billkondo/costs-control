import PropTypes from 'prop-types';
import { createContext, useCallback, useState } from 'react';
import * as FirebaseFirestore from '../firebase/firestore';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} CardsState
 * @property {UserCard[]} cards
 * @property {(card: Card) => Promise<void>} addCard
 * @property {() => Promise<void>} loadCards
 */

/** @type {import('react').Context<CardsState>} */
export const CardsContext = createContext({
  cards: [],
  addCard: async () => {},
  loadCards: async () => {},
});

/**
 * @param {import('react').PropsWithChildren} props
 */
const CardsProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useAuthentication();

  const [loaded, setLoaded] = useState(false);
  const [cards, setCards] = useState(/** @type {UserCard[]} */ ([]));

  const loadCards = useCallback(async () => {
    if (loaded) {
      return;
    }

    setLoaded(true);

    const cards = await FirebaseFirestore.getUserCards(authenticatedUserId);

    setCards(cards);
  }, [authenticatedUserId, loaded]);

  /**
   * @param {Card} card
   */
  const addCard = async (card) => {
    /** @type {UserCard} */
    const userCard = {
      ...card,
      userId: authenticatedUserId,
      id: null,
    };

    const newCard = await FirebaseFirestore.addUserCard(userCard);

    updateCardsWithNewCard(newCard);
  };

  /**
   * @param {UserCard} userCard
   */
  const updateCardsWithNewCard = async (userCard) => {
    await loadCards();

    setCards((cards) => cards.concat(userCard));
  };

  return (
    <CardsContext.Provider value={{ cards, addCard, loadCards }}>
      {children}
    </CardsContext.Provider>
  );
};

CardsProvider.propTypes = {
  children: PropTypes.node,
};

export default CardsProvider;
