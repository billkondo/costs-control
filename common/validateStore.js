/**
 * @param {Store} store
 * @returns {StoreError | null}
 */
const validateStore = (store) => {
  const { name } = store;

  /** @type {StoreError} */
  const errors = {};

  if (!name) {
    errors.name = 'Enter the store name';
  }

  if (!Object.keys(errors).length) {
    return null;
  }

  return errors;
};

export default validateStore;
