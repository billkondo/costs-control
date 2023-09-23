/**
 * @returns {string}
 */
const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export default getUserTimezone;
