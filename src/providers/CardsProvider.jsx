import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import FirebaseFirestore from '../firebase/firestore';
import FirebaseFunctions from '../firebase/functions';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} CardsState
 * @property {UserCard[]} cards
 * @property {{ [cardId: string]: UserCard }} cardsById
 * @property {(card: Card) => Promise<void>} addCard
 * @property {(cardId: string) => UserCard | null} getCardById
 */

/** @type {CardsState} */
const defaultCardsState = {
  cards: [],
  cardsById: {},
  addCard: async () => {},
  getCardById: () => null,
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

  const cardsById = useMemo(() => {
    /** @type {{ [cardId: string]: UserCard }} */
    const cardsById = {};

    for (const card of cards) {
      const { id } = card;

      cardsById[id] = card;
    }

    return cardsById;
  }, [cards]);

  const loadCards = useCallback(async () => {
    if (loaded) {
      return;
    }

    setLoaded(true);

    const cards = await FirebaseFirestore.cards.getAll(authenticatedUserId);

    setCards(cards);
  }, [authenticatedUserId, loaded]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

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

  const getCardById = useCallback(
    /**
     * @param {string} cardId
     */
    (cardId) => {
      const card = cardsById[cardId];

      if (!card) {
        return null;
      }

      return card;
    },
    [cardsById]
  );

  return (
    <CardsContext.Provider value={{ cards, cardsById, addCard, getCardById }}>
      {children}
    </CardsContext.Provider>
  );
};

CardsProvider.propTypes = {
  children: PropTypes.node,
};

export default CardsProvider;
