'use strict';

(function() {
  var BaseComponent = function(el, container) {
    this.element = el;
    this.container = container;
  };

  BaseComponent.prototype._setEventListeners = function() {};

  BaseComponent.prototype._removeEventListeners = function() {};

  BaseComponent.prototype._setHTML = function(htmlText) {
    this.element.innerHTML = htmlText;
  };

  BaseComponent.prototype.init = function() {
    this._setEventListeners();
    this.container.appendChild(this.element);
  };

  BaseComponent.prototype.remove = function(element) {
    this._removeEventListeners();
    element.parentNode.removeChild(element);
  };

  module.exports = BaseComponent;
})();
