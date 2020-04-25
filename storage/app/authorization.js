'use strict';

/**
 * Class for authorizate action of user
 */
exports.Authorization = class {

  /**
   * Constructor
   * @param {string} password 
   * @param {object} configuration
   */
  constructor(password, configuration) {
    this.password = password;
    this.configuration = configuration;
  }


  /**
   * Method for do autorize action
   */
  auth() {
    return new Promise((resolve, reject) => {
      if (!this.password) {
        reject();
      }
      if (this.password === this.configuration.storage.password) {
        resolve();
      } else {
        reject();
      }
    });
  }
}