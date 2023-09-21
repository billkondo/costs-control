import { useMemo, useState } from 'react';
import useCards from '../providers/useCards';
import useStores from '../providers/useStores';

const useIncompleteExpenses = () => {
  const [incompleteExpenses, setIncompleteExpenses] = useState(
    /** @type {IncompleteUserExpense[]} */ ([])
  );

  const { storesById } = useStores();
  const { cardsById } = useCards();

  const expenses = useMemo(() => {
    /** @type {UserExpense[]} */
    const expenses = incompleteExpenses.map((incompleteExpense) => {
      const { cardId, storeId } = incompleteExpense;

      const card = cardId ? cardsById[cardId] : null;
      const store = storesById[storeId];

      /** @type {UserExpense} */
      const expense = {
        ...incompleteExpense,
        store,
        card,
      };

      return expense;
    });

    return expenses;
  }, [incompleteExpenses, cardsById, storesById]);

  return {
    setIncompleteExpenses,
    expenses,
  };
};

export default useIncompleteExpenses;
