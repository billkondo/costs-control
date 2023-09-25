/**
 * @returns {Month}
 */
const getCurrentMonth = () => {
  const date = new Date();

  return {
    month: date.getMonth(),
    year: date.getFullYear(),
  };
};

export default getCurrentMonth;
