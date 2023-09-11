/**
 * @param {number} waitTime
 */
const wait = (waitTime = 800) => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitTime);
  });
};

export default wait;
