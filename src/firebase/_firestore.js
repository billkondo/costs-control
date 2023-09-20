import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '.';

const getFixedCostsCollection = () => {
  return collection(db, 'fixedCosts');
};

const getMonthlyFixedCostsCollection = () => {
  return collection(db, 'monthlyFixedCosts');
};

/**
 * @param {string} userId
 * @param {(fixedCost: FixedCost) => void} onFixedCostChanged
 */
export const fixedCostListener = (userId, onFixedCostChanged) => {
  const fixedCostQuery = query(
    getFixedCostsCollection(),
    where('userId', '==', userId)
  );

  const unsubscribe = onSnapshot(fixedCostQuery, (querySnapshot) => {
    if (!querySnapshot.docs.length) {
      return null;
    }

    /** @type {UserFixedCostDBData} */
    // @ts-ignore
    const userFixedCostDBData = querySnapshot.docs[0].data();

    onFixedCostChanged({ ...userFixedCostDBData });
  });

  return unsubscribe;
};

/**
 * @param {string} userId
 * @param {(monthlyFiexCost: UserMonthlyFixedCost) => void} onMonthlyFixedCostChanged
 */
export const monthlyFixedCostsListener = (
  userId,
  onMonthlyFixedCostChanged
) => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();

  const monthlyFixedCostQuery = query(
    getMonthlyFixedCostsCollection(),
    where('userId', '==', userId),
    where('month', '==', currentMonth)
  );

  const unsubscribe = onSnapshot(monthlyFixedCostQuery, (querySnapshot) => {
    if (!querySnapshot.docs.length) {
      return null;
    }

    /** @type {UserMonthlyFixedCostDBData} */
    // @ts-ignore
    const monthlyFixedCostDBData = querySnapshot.docs[0].data();

    onMonthlyFixedCostChanged(monthlyFixedCostDBData);
  });

  return unsubscribe;
};
