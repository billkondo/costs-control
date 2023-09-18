const getCurrentMonth = () => {
  const now = new Date();

  return now.getUTCMonth();
};

export default getCurrentMonth;
