const getCurrentMonth = () => {
  const now = new Date();

  return now.getUTCMonth() + 1;
};

export default getCurrentMonth;
