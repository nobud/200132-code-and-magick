'use strict';

(function() {

  var BaseComponent = require('./base');
  var utils = require('./utils');

  /**
   * @param {Object} data
   * @param {Element} container
   * @constructor
   */
  var Review = function(data, container, templateToClone) {
    this.data = data;
    var getReviewElement = require('./getReviewElement');
    this.element = getReviewElement(this.data, container, templateToClone);
    this.container = container;
    this._onQuizClick = this._onQuizClick.bind(this);

    this.init();
  };
  utils.inherit(BaseComponent, Review);

  Review.prototype._setEventListeners = function() {
    this.element.addEventListener('click', this._onQuizClick, true);
  };

  Review.prototype._removeEventListeners = function() {
    this.element.removeEventListener('click', this._onQuizClick);
  };

  Review.prototype.init = function() {
    BaseComponent.prototype.init.call(this);
  };

  Review.prototype._onQuizClick = function(evt) {
    var e = evt.target;
    if (e.classList.contains('review-quiz-answer')) {
      e.classList.add('review-quiz-answer-active');
    }
  };

  Review.prototype.remove = function() {
    BaseComponent.prototype.remove.call(this, this.element);
  };

  module.exports = Review;
})();
