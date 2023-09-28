/**
 * @returns {Mode}
 */
const getMode = () => {
  const mode = /** @type {Mode} */ (process.env.SERVER_ENV);

  if (!mode) {
    return 'development';
  }

  return mode;
};

export default getMode;
