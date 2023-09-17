import { limit, startAfter } from 'firebase/firestore';

/**
 * @template T
 * @param {QueryParams<T>} params
 * @returns {import('firebase/firestore').QueryNonFilterConstraint[]}
 */
const getConstraints = (params) => {
  const { lastDocument, maxSize } = params;

  /** @type {import('firebase/firestore').QueryNonFilterConstraint[]} */
  const constraints = [];

  if (maxSize) {
    constraints.push(limit(maxSize));
  }

  if (lastDocument) {
    constraints.push(startAfter(lastDocument));
  }

  return constraints;
};

export default getConstraints;
