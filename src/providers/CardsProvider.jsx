import PropTypes from 'prop-types';
import { createContext, useCallback, useState } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import FirebaseFunctions from '../firebase/functions';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} CardsState
 * @property {UserCard[]} cards
 * @property {(card: Card) => Promise<void>} addCard
 * @property {() => Promise<void>} loadCards
 */

/** @type {CardsState} */
const defaultCardsState = {
  cards: [],
  addCard: async () => {},
  loadCards: async () => {},
};

export const CardsContext = createContext(defaultCardsState);

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

    const cards = await FirebaseFirestore.cards.getAll(authenticatedUserId);

    setCards(cards);
  }, [authenticatedUserId, loaded]);

  /**
   * @param {Card} card
   */
  const addCard = async (card) => {
    const newCard = await FirebaseFunctions.cards.add(card);

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
