/**
 * @param {Card} card
 * @returns {CardError | null}
 */
const validateCard = (card) => {
  const { lastBuyDay, lastFourDigits, name } = card;

  /** @type {CardError} */
  const errors = {};

  if (!lastBuyDay) {
    errors['lastBuyDay'] =
      'Select the day that buys after it are charged on the following month';
  }

  if (!isLastFourDigitsValid(lastFourDigits)) {
    errors['lastFourDigits'] = 'Card last four digits are invalid';
  }

  if (!name) {
    errors['name'] = 'Enter a card name';
  }

  if (!Object.keys(errors).length) {
    return null;
  }

  return errors;
};

/**
 * @param {number} lastFourDigits
 * @returns {boolean}
 */
const isLastFourDigitsValid = (lastFourDigits) => {
  if (!lastFourDigits) return false;

  if (lastFourDigits.toString().length !== 4) {
    return false;
  }

  return true;
};

export default validateCard;
