const getCurrentYear = () => {
  const now = new Date();

  return now.getUTCFullYear();
};

export default getCurrentYear;
