/// <reference path="../types.d.ts"/>
/// <reference path="../../types.d.ts"/>

import * as firebase from 'firebase-admin';
import * as functionsV2 from 'firebase-functions/v2';
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

exports.addExpense = functionsV2.https.onCall(
  /**
   * @param {FunctionCall<AddExpenseRequest>} request
   */
  async (request) => {
    if (!request.auth) {
      throw new functionsV2.https.HttpsError(
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

exports.addCard = functionsV2.https.onCall(
  /**
   * @param {FunctionCall<AddCardRequest>} request
   * @returns {Promise<AddCardResponse>}
   */
  async (request) => {
    if (!request.auth) {
      throw new functionsV2.https.HttpsError(
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

exports.addStore = functionsV2.https.onCall(
  /**
   * @param {FunctionCall<AddStoreRequest>} request
   * @returns {Promise<AddStoreResponse>}
   */
  async (request) => {
    if (!request.auth) {
      throw new functionsV2.https.HttpsError(
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

exports.addSubscription = functionsV2.https.onCall(
  /**
   * @param {FunctionCall<AddSubscriptionRequest>} request
   * @returns {Promise<AddSubscriptionResponse>}
   */
  async (request) => {
    if (!request.auth) {
      throw new functionsV2.https.HttpsError(
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
exports.onUserExpenseCreated = functionsV2.firestore.onDocumentCreated(
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
exports.onUserExpenseDeleted = functionsV2.firestore.onDocumentDeleted(
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
exports.onUserExpenseUpdated = functionsV2.firestore.onDocumentUpdated(
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

exports.addUser = functionsV2.https.onCall(
  /**
   * @param {FunctionCall<AddUserRequest>} request
   */
  async (request) => {
    const { email, name, password, timezone } = request.data;

    const user = await firebase.auth().createUser({
      email,
      password,
      displayName: name,
    });
    await firebase.auth().setCustomUserClaims(user.uid, { timezone });
  }
);
