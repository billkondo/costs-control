/**
 * @returns {Mode}
 */
const getMode = () => {
  const mode = /** @type {Mode} */ (process.env.NODE_ENV);

  return mode;
};

export default getMode;
