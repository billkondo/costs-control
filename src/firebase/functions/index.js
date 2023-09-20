import cards from './cards';
import expenses from './expenses';
import stores from './stores';

const FirebaseFunctions = {
  cards,
  expenses,
  stores,
  init: () => {
    cards.init();
    expenses.init();
    stores.init();
  },
};

export default FirebaseFunctions;
