'use strict';

(function() {

  var lastCall = Date.now();

  module.exports = {

    /**
     * @param {HTMLElement} elementTemplate
     * @param {string} classElementToClone
     * @return {HTMLElement}
     */
    getElementToClone: function(elementTemplate, classElementToClone) {
      var cloneElement;
      if ('content' in elementTemplate) {
        cloneElement = elementTemplate.content.querySelector(
          classElementToClone);
      } else { //если браузер не поддерживает тег template
        cloneElement = elementTemplate.querySelector(classElementToClone);
      }
      return cloneElement;
    },

    /**
     * @param {HTMLElement} template
     * @param {HTMLElement} container
     * @param {string} text
     * @return {HTMLElement}
     */
    showMessage: function(template, container, text) {
      container.innerHTML = '';
      var message = template.cloneNode(true);
      var messageText = message.querySelector('.notify-message-text');
      messageText.textContent = text;
      container.appendChild(message);
      return message;
    },

    /**
     * @param {function()} method
     * @param {number} period
     * @param {Object} scope
     */
    throttle: function(method, period, scope) {
      return function() {
        var result = false;
        if (Date.now() - lastCall >= period) {
          result = method.call(scope);
          lastCall = Date.now();
        }
        return result;
      };
    },

    setLocationHash: function(value) {
      location.hash = value;
    }
  };
})();
