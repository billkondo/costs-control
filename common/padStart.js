/**
 * @param {number} value
 * @returns {string}
 */
const padStart = (value) => {
  if (value < 10) {
    return '0' + value;
  }

  return value.toString();
};

export default padStart;
