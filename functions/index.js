/// <reference path="../types.d.ts"/>

const {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} = require('firebase-functions/v2/firestore');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccount.json');

const app = initializeApp({
  // @ts-ignore
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

const userMonthlyExpensesCollection = db.collection('monthlyExpenses');

/**
 * @param {UserExpenseDBData} userExpenseDBData
 * @returns {Promise<UserMonthlyExpense>}
 */
const getUserMonthlyExpenseFromUserExpenseDBData = async (
  userExpenseDBData
) => {
  const { userId, date: timestamp } = userExpenseDBData;
  const date = timestamp.toDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  const querySnapshot = await userMonthlyExpensesCollection
    .where(Filter.where('month', '==', month))
    .where(Filter.where('year', '==', year))
    .get();

  /** @type {UserMonthlyExpense[]} */
  // @ts-ignore
  const docs = querySnapshot.docs;

  if (!docs.length) {
    return {
      id: null,
      userId,
      month,
      year,
      value: 0,
    };
  }

  const userMonthlyExpenseDoc = querySnapshot.docs[0];

  /** @type {UserMonthlyExpenseDBData} */
  // @ts-ignore
  const userMonthlyExpenseDBData = userMonthlyExpenseDoc.data();

  return {
    ...userMonthlyExpenseDBData,
    id: userMonthlyExpenseDoc.id,
  };
};

/**
 * @param {UserMonthlyExpense} userMonthlyExpense
 * @returns {Promise<void>}
 */
const saveUserMonthlyExpense = async (userMonthlyExpense) => {
  const { id } = userMonthlyExpense;
  const shouldCreateRecord = !id;

  if (shouldCreateRecord) {
    const userMonthlyExpenseRef = userMonthlyExpensesCollection.doc();

    /** @type {UserMonthlyExpenseDBData} */
    const userMonthlyExpenseDBData = {
      ...userMonthlyExpense,
      id: userMonthlyExpenseRef.id,
    };

    await userMonthlyExpenseRef.set(userMonthlyExpenseDBData);
  } else {
    await userMonthlyExpensesCollection.doc(id).update(userMonthlyExpense);
  }
};

exports.onUserExpenseCreated = onDocumentCreated(
  'expenses/{docId}',
  async (event) => {
    /** @type {UserExpenseDBData} */
    // @ts-ignore
    const userExpenseDBData = event.data.data();

    const userMonthlyExpense = await getUserMonthlyExpenseFromUserExpenseDBData(
      userExpenseDBData
    );

    userMonthlyExpense.value += userExpenseDBData.value;

    await saveUserMonthlyExpense(userMonthlyExpense);
  }
);

exports.onUserExpenseDeleted = onDocumentDeleted(
  'expenses/{docId}',
  async (event) => {
    /** @type {UserExpenseDBData} */
    // @ts-ignore
    const userExpenseDBData = event.data.data();

    const userMonthlyExpense = await getUserMonthlyExpenseFromUserExpenseDBData(
      userExpenseDBData
    );

    userMonthlyExpense.value -= userExpenseDBData.value;

    await saveUserMonthlyExpense(userMonthlyExpense);
  }
);

exports.onUserExpenseUpdated = onDocumentUpdated(
  'expenses/{docId}',
  async (event) => {
    /** @type {UserExpenseDBData} */
    // @ts-ignore
    const beforeUserExpenseDBData = event.data.before.data();

    /** @type {UserExpenseDBData} */
    // @ts-ignore
    const afterUserExpenseDBData = event.data.before.data();

    const userMonthlyExpense = await getUserMonthlyExpenseFromUserExpenseDBData(
      afterUserExpenseDBData
    );

    userMonthlyExpense.value +=
      afterUserExpenseDBData.value - beforeUserExpenseDBData.value;

    await saveUserMonthlyExpense(userMonthlyExpense);
  }
);
