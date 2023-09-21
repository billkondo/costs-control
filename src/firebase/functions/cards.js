import { httpsCallable } from 'firebase/functions';
import { functions } from '..';

/** @type {FunctionCall<AddCardRequest, AddCardResponse>} */
const addCardFunction = httpsCallable(functions, 'addCard');

/**
 * @param {Card} card
 * @returns {Promise<UserCard>}
 */
const add = async (card) => {
  const request = await addCardFunction(card);
  const userCard = request.data;

  return userCard;
};

export default {
  add,
};
