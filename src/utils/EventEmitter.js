class EventEmitter {
  /** @type {{ [eventName: string]: (() => void)[] }} */
  listeners = {};

  /**
   * @param {string} eventName
   * @param {() => void} callback
   */
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);
  }

  /**
   * @param {string} eventName
   * @param {() => void} callback
   */
  off(eventName, callback) {
    if (!this.listeners[eventName]) {
      return;
    }

    this.listeners[eventName] = this.listeners[eventName].filter(
      (listener) => listener !== callback
    );

    if (!this.listeners[eventName].length) {
      delete this.listeners[eventName];
    }
  }

  /**
   * @param {string} eventName
   */
  emit(eventName) {
    if (!this.listeners[eventName]) {
      return;
    }

    for (const listener of this.listeners[eventName]) {
      listener();
    }
  }
}

export default EventEmitter;
