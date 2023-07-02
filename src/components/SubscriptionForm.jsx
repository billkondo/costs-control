import { useContext, useRef, useState } from 'react';
import { ExpensesContext } from '../providers/ExpensesProvider';

/**
 * @typedef {object} FormTarget
 * @property {HTMLInputElement} value
 * @property {HTMLInputElement} type
 * @property {HTMLInputElement} day
 * @property {HTMLInputElement} month
 */

const SubscriptionForm = () => {
  /** @type {import('react').Ref<HTMLFormElement>} */
  const formRef = useRef(null);

  const { addSubscription } = useContext(ExpensesContext);

  const [type, setType] = useState(/** @type {SubscriptionType} */ ('MONTHLY'));

  /**
   * @param {import("react").SyntheticEvent} event
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    /** @type {EventTarget & FormTarget} */
    // @ts-ignore
    const target = event.target;

    const value = target.value.valueAsNumber;

    /** @type {SubscriptionType} */
    // @ts-ignore
    const type = target.type.value;

    const day = target.day.valueAsNumber;
    const month = target.month.valueAsNumber;

    /** @type {Subscription} */
    const subscription = {
      value: isNaN(value) ? null : value,
      type,
      day: isNaN(day) ? null : day,
      month: isNaN(month) ? null : month,
    };

    await addSubscription(subscription);

    formRef.current.reset();
  };

  return (
    <form onSubmit={onSubmit} noValidate ref={formRef}>
      <label htmlFor="subscription-value">Value</label>
      <input name="value" id="subscription-value" type="number" />

      <label htmlFor="subscription-type-monthly">Monthly</label>
      <input
        type="radio"
        id="subscription-type-monthly"
        name="type"
        value="MONTHLY"
        checked={type === 'MONTHLY'}
        onChange={() => setType('MONTHLY')}
      />

      <label htmlFor="subscription-type-yearly">Yearly</label>
      <input
        type="radio"
        id="subscription-type-yearly"
        name="type"
        value="YEARLY"
        checked={type === 'YEARLY'}
        onChange={() => setType('YEARLY')}
      />

      <label htmlFor="subscription-day">Charge day</label>
      <input type="number" id="subscription-day" name="day" min="1" max="31" />

      <label htmlFor="subscription-month" hidden={type !== 'YEARLY'}>
        Charge month
      </label>
      <input
        type="number"
        id="subscription-month"
        name="month"
        min="1"
        max="12"
        hidden={type !== 'YEARLY'}
      />

      <input type="submit" value="Create subscription" />
    </form>
  );
};

export default SubscriptionForm;
