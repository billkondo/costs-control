/// <reference path="./types.d.ts"/>
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

/** @type {FirebaseCollection<UserMonthlyExpenseDBData>} */
// @ts-ignore
const userMonthlyExpensesCollection = db.collection('monthlyExpenses');

/** @type {FirebaseCollection<UserFixedCostDBData>} */
// @ts-ignore
const fixedCostCollection = db.collection('fixedCosts');

/** @type {FirebaseCollection<UserMonthlyFixedCostDBData>} */
// @ts-ignore
const monthlyFixedCostCollection = db.collection('monthlyFixedCosts');

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
    .where(Filter.where('userId', '==', userId))
    .get();

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

/**
 * @param {string} userId
 * @returns {Promise<UserFixedCost>}
 */
const getUserFixedCost = async (userId) => {
  const querySnapshot = await fixedCostCollection
    .where('userId', '==', userId)
    .get();

  if (!querySnapshot.docs.length) {
    return {
      id: null,
      userId,
      value: 0,
    };
  }

  const fixedCostDoc = querySnapshot.docs[0];

  const fixedCostDBData = fixedCostDoc.data();

  return {
    ...fixedCostDBData,
  };
};

/**
 * @param {string} userId
 * @param {number} month
 * @returns {Promise<UserMonthlyFixedCost>}
 */
const getUserMonthlyFixedCost = async (userId, month) => {
  const querySnapshot = await monthlyFixedCostCollection
    .where('userId', '==', userId)
    .where('month', '==', month)
    .get();

  if (!querySnapshot.docs.length) {
    return {
      id: null,
      month,
      userId,
      value: 0,
    };
  }

  const monthlyFixedCostDBData = querySnapshot.docs[0].data();

  return {
    ...monthlyFixedCostDBData,
  };
};

/**
 * @param {UserFixedCost} userFixedCost
 */
const saveUserFixedCost = async (userFixedCost) => {
  const { id } = userFixedCost;
  const shouldCreateRecord = !id;

  if (shouldCreateRecord) {
    const userFixedCostRef = fixedCostCollection.doc();

    /** @type {UserFixedCostDBData} */
    const userFixedCostDBData = {
      ...userFixedCost,
      id: userFixedCostRef.id,
    };

    await userFixedCostRef.set(userFixedCostDBData);
  } else {
    await fixedCostCollection.doc(id).update(userFixedCost);
  }
};

/**
 * @param {UserMonthlyFixedCost} userMonthlyFixedCost
 */
const saveUserMonthlyFixedCost = async (userMonthlyFixedCost) => {
  const { id } = userMonthlyFixedCost;
  const shouldCreateRecord = !id;

  if (shouldCreateRecord) {
    const userMonthlyFixedCostRef = monthlyFixedCostCollection.doc();

    /** @type {UserMonthlyFixedCostDBData} */
    const userMonthlyFixedCostDBData = {
      ...userMonthlyFixedCost,
      id: userMonthlyFixedCostRef.id,
    };

    await userMonthlyFixedCostRef.set(userMonthlyFixedCostDBData);
  } else {
    await monthlyFixedCostCollection.doc(id).update(userMonthlyFixedCost);
  }
};

exports.onUserExpenseCreated = onDocumentCreated(
  'expenses/{docId}',
  /**
   * @param {CreateEvent<UserExpenseDBData>} event
   */
  async (event) => {
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
  /**
   * @param {DeleteEvent<UserExpenseDBData>} event
   */
  async (event) => {
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
  /**
   * @param {UpdateEvent<UserExpenseDBData>} event
   */
  async (event) => {
    const beforeUserExpenseDBData = event.data.before.data();
    const afterUserExpenseDBData = event.data.after.data();

    const userMonthlyExpense = await getUserMonthlyExpenseFromUserExpenseDBData(
      afterUserExpenseDBData
    );

    userMonthlyExpense.value +=
      afterUserExpenseDBData.value - beforeUserExpenseDBData.value;

    await saveUserMonthlyExpense(userMonthlyExpense);
  }
);

exports.onUserSubscriptionCreated = onDocumentCreated(
  'subscriptions/{docId}',
  /**
   * @param {CreateEvent<UserSubscriptionDBData>} event
   */
  async (event) => {
    const userSubscriptionDBData = event.data.data();

    const { userId, value, type, month } = userSubscriptionDBData;

    if (type === 'MONTHLY') {
      const userFixedCost = await getUserFixedCost(userId);

      userFixedCost.value += value;

      await saveUserFixedCost(userFixedCost);
    }

    if (type === 'YEARLY') {
      const userMonthlyFixedCost = await getUserMonthlyFixedCost(userId, month);

      userMonthlyFixedCost.value += value;

      await saveUserMonthlyFixedCost(userMonthlyFixedCost);
    }
  }
);

exports.onUserSubscriptionDeleted = onDocumentDeleted(
  'subscriptions/{docId}',
  /**
   * @param {DeleteEvent<UserSubscriptionDBData>} event
   */
  async (event) => {
    const userSubscriptionDBData = event.data.data();

    const { userId, value, type, month } = userSubscriptionDBData;

    if (type === 'MONTHLY') {
      const userFixedCost = await getUserFixedCost(userId);

      userFixedCost.value -= value;

      await saveUserFixedCost(userFixedCost);
    }

    if (type === 'YEARLY') {
      const userMonthlyFixedCost = await getUserMonthlyFixedCost(userId, month);

      userMonthlyFixedCost.value -= value;

      await saveUserMonthlyFixedCost(userMonthlyFixedCost);
    }
  }
);

exports.onUserSubscriptionUpdated = onDocumentUpdated(
  'subscriptions/{docId}',
  /**
   * @param {UpdateEvent<UserSubscriptionDBData>} event
   */
  async (event) => {
    const beforeUserSubscription = event.data.before.data();
    const afterUserSubscription = event.data.after.data();

    const { userId, type, month } = afterUserSubscription;

    if (type === 'MONTHLY') {
      const userFixedCost = await getUserFixedCost(userId);

      userFixedCost.value +=
        afterUserSubscription.value - beforeUserSubscription.value;

      await saveUserFixedCost(userFixedCost);
    }

    if (type === 'YEARLY') {
      const userMonthlyFixedCost = await getUserMonthlyFixedCost(userId, month);

      userMonthlyFixedCost.value +=
        afterUserSubscription.value - beforeUserSubscription.value;

      await saveUserMonthlyFixedCost(userMonthlyFixedCost);
    }
  }
);
