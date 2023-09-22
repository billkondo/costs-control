import { db } from '.';

/** @type {Collection<UserMonthlyExpenseDBData>} */
// @ts-ignore
const collection = db.collection('monthlyExpenses');

/**
 * @param {string} userId
 * @param {number} month
 * @param {number} year
 * @returns {Promise<UserMonthlyExpenseDBData>}
 */
const getByMonthAndYear = async (userId, month, year) => {
  const snapshot = await collection
    .where('userId', '==', userId)
    .where('month', '==', month)
    .where('year', '==', year)
    .get();

  if (!snapshot.docs.length) {
    return {
      id: null,
      userId,
      month,
      year,
      value: 0,
    };
  }

  const monthlyExpense = snapshot.docs[0].data();

  return monthlyExpense;
};

/**
 * @param {UserMonthlyExpenseDBData} data
 */
const save = async (data) => {
  const { id } = data;
  const shouldCreateRecord = !id;

  if (shouldCreateRecord) {
    const userMonthlyExpenseRef = collection.doc();

    /** @type {UserMonthlyExpenseDBData} */
    const newData = {
      ...data,
      id: userMonthlyExpenseRef.id,
    };

    await userMonthlyExpenseRef.set(newData);
  } else {
    await collection.doc(id).update(data);
  }
};

const MonthlyExpenses = {
  getByMonthAndYear,
  save,
};

export default MonthlyExpenses;
