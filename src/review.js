'use strict';

(function() {

  var BaseComponent = require('./base');
  var utils = require('./utils');
  var ReviewElement = require('./getReviewElement');

  /**
   * @param {Object} data
   * @param {Element} container
   * @constructor
   */
  var Review = function(templateToClone, container, data) {
    BaseComponent.call(this, null, container);
    this.data = data;
    this.objectElement = new ReviewElement(templateToClone, container,
      this.data);
    this.element = this.objectElement.element;
    this._onQuizClick = this._onQuizClick.bind(this);
    this._onDataUsefulnessChange = this._onDataUsefulnessChange.bind(this);
    this.init();

  };
  utils.inherit(BaseComponent, Review);

  Review.prototype._setEventListeners = function() {
    this.objectElement.reviewQuiz.addEventListener('click', this._onQuizClick);
    window.addEventListener('dataChange', this._onDataUsefulnessChange);
  };

  Review.prototype._removeEventListeners = function() {
    this.objectElement.reviewQuiz.removeEventListener('click', this._onQuizClick);
    window.removeEventListener('dataChange', this._onDataUsefulnessChange);
  };

  Review.prototype.init = function() {
    BaseComponent.prototype.init.call(this);
  };

  Review.prototype._onQuizClick = function(evt) {
    var elem = evt.target;

    if (this.objectElement.isYes(elem)) {
      this.data.upReviewUsefulness();
    } else if (this.objectElement.isNot(elem)) {
      this.data.downReviewUsefulness();
    }
  };

  Review.prototype._onDataUsefulnessChange = function(evt) {
    var sender = evt.detail.sender;
    if (sender === this.data) {
      this.objectElement.quizUpdate();
      this.objectElement.reviewQuiz.removeEventListener('click', this._onQuizClick);
    }
  };

  Review.prototype.remove = function() {
    BaseComponent.prototype.remove.call(this, this.element);
  };

  module.exports = Review;
})();
