import expenses from './expenses';

const FirebaseFunctions = {
  expenses,
  init: () => {
    expenses.init();
  },
};

export default FirebaseFunctions;
