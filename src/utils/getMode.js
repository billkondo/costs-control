/**
 * @returns {Mode}
 */
const getMode = () => {
  const mode = /** @type {Mode} */ (import.meta.env.MODE);

  return mode;
};

export default getMode;
