import { getDocs } from 'firebase/firestore';

/**
 * @template T
 * @param {string} userId
 * @param {(params: QueryParams<T>) => FirestoreQuery<T>} getQuery
 * @returns {(start?: number) => Promise<T[]>}
 */
const Pager = (userId, getQuery) => {
  /** @type {{ [index: number]: FirestoreQueryDocumentSnapshot<T>}} */
  const cache = {};

  /**
   * @param {number} start
   * @param {number} maxSize
   */
  const callback = async (start = 0, maxSize = 5) => {
    const lastDocument = start ? cache[start] : null;
    const query = getQuery({
      userId,
      lastDocument,
      maxSize,
    });
    const snapshot = await getDocs(query);
    const docs = snapshot.docs;
    const userSubscriptionDBData = docs.map((doc) => doc.data());
    const lastDocumentInQuery = docs[docs.length - 1];
    const lastIndex = start + userSubscriptionDBData.length;

    cache[lastIndex] = lastDocumentInQuery;

    console.log(start, lastIndex, cache);

    return userSubscriptionDBData;
  };

  return callback;
};

export default Pager;
