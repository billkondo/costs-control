/// <reference path="../types.d.ts"/>
/// <reference path="../../types.d.ts"/>

import * as functions from 'firebase-functions/v2';
import Subscriptions from './firestore/Subscriptions';
import Stores from './firestore/Stores';
import MonthlyExpenses from './firestore/MonthlyExpenses';
import Cards from './firestore/Cards';
import Expenses from './firestore/Expenses';
import isImmediateExpense from '../../common/isImmediateExpense';
import getExpensePayment from '../../common/getExpensePayment';

/**
 * @param {UserExpenseDBData} userExpenseDBData
 * @param {boolean?} increment
 */
const updateMonthlyExpenses = async (userExpenseDBData, increment = true) => {
  const { cardId, userId } = userExpenseDBData;

  /** @type {Expense} */
  const expense = {
    ...userExpenseDBData,
    store: {
      id: '',
      name: '',
      userId: '',
    },
    card: null,
    buyDate: userExpenseDBData.buyDate.toDate(),
  };

  if (!isImmediateExpense(expense)) {
    expense.card = await Cards.getCardById(/** @type {string} */ (cardId));
  }

  const { paymentDates, partsValue } = getExpensePayment(expense);

  for (const paymentDate of paymentDates) {
    const { month, year } = paymentDate;
    const monthlyExpense = await MonthlyExpenses.getByMonthAndYear(
      userId,
      month,
      year
    );

    if (increment) {
      monthlyExpense.value += partsValue;
    } else {
      monthlyExpense.value -= partsValue;
    }

    await MonthlyExpenses.save(monthlyExpense);
  }
};

exports.addExpense = functions.https.onCall(
  /**
   * @param {FunctionCall<AddExpenseRequest>} request
   */
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Request is not authenticated'
      );
    }

    const data = request.data;
    const userId = request.auth.uid;

    /** @type {Expense} */
    const expense = {
      ...data,
      buyDate: new Date(data.buyDate),
    };

    await Expenses.add(userId, expense);
  }
);

exports.addCard = functions.https.onCall(
  /**
   * @param {FunctionCall<AddCardRequest>} request
   * @returns {Promise<AddCardResponse>}
   */
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Request is not authenticated'
      );
    }

    const card = request.data;
    const userId = request.auth.uid;
    const userCard = await Cards.add(userId, card);

    return userCard;
  }
);

exports.addStore = functions.https.onCall(
  /**
   * @param {FunctionCall<AddStoreRequest>} request
   * @returns {Promise<AddStoreResponse>}
   */
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Request is not authenticated'
      );
    }

    const store = request.data;
    const userId = request.auth.uid;
    const userStore = await Stores.add(userId, store);

    return userStore;
  }
);

exports.addSubscription = functions.https.onCall(
  /**
   * @param {FunctionCall<AddSubscriptionRequest>} request
   * @returns {Promise<AddSubscriptionResponse>}
   */
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Request is not authenticated'
      );
    }

    const subscription = request.data;
    const userId = request.auth.uid;
    const userSubscription = Subscriptions.add(userId, subscription);

    return userSubscription;
  }
);

// @ts-ignore
exports.onUserExpenseCreated = functions.firestore.onDocumentCreated(
  'expenses/{docId}',
  /**
   * @param {CreateEvent<UserExpenseDBData>} event
   */
  async (event) => {
    const userExpenseDBData = event.data.data();

    await updateMonthlyExpenses(userExpenseDBData);
  }
);

// @ts-ignore
exports.onUserExpenseDeleted = functions.firestore.onDocumentDeleted(
  'expenses/{docId}',
  /**
   * @param {DeleteEvent<UserExpenseDBData>} event
   */
  async (event) => {
    const userExpenseDBData = event.data.data();

    await updateMonthlyExpenses(userExpenseDBData, false);
  }
);

// @ts-ignore
exports.onUserExpenseUpdated = functions.firestore.onDocumentUpdated(
  'expenses/{docId}',
  /**
   * @param {UpdateEvent<UserExpenseDBData>} event
   */
  async (event) => {
    const beforeUserExpenseDBData = event.data.before.data();
    const afterUserExpenseDBData = event.data.after.data();

    await updateMonthlyExpenses(beforeUserExpenseDBData, false);
    await updateMonthlyExpenses(afterUserExpenseDBData);
  }
);
