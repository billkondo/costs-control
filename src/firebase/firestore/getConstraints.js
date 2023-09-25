import { limit, orderBy, startAfter } from 'firebase/firestore';

/**
 * @template T
 * @param {QueryParams<T>} params
 * @returns {import('firebase/firestore').QueryNonFilterConstraint[]}
 */
const getConstraints = (params) => {
  const { lastDocument, maxSize, orderBy: orderByParam } = params;

  /** @type {import('firebase/firestore').QueryNonFilterConstraint[]} */
  const constraints = [];

  if (maxSize) {
    constraints.push(limit(maxSize));
  }

  if (lastDocument) {
    constraints.push(startAfter(lastDocument));
  }

  if (orderByParam) {
    constraints.push(orderBy(...orderByParam));
  }

  return constraints;
};

export default getConstraints;
