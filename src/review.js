'use strict';

(function() {

  /**
   * @param {Object} data
   * @param {Element} container
   * @constructor
   */
  var Review = function(data, container, templateToClone) {
    this.data = data;
    var getReviewElement = require('./getReviewElement');
    this.element = getReviewElement(this.data, container, templateToClone);

    Review.prototype.onQuizClick = function(evt) {
      var e = evt.target;
      if (e.classList.contains('review-quiz-answer')) {
        e.classList.add('review-quiz-answer-active');
      }
    };

    Review.prototype.remove = function() {
      this.element.removeEventListener('click', this.onQuizClick);
      this.element.parentNode.removeChild(this.element);
    };

    this.onQuizClick = this.onQuizClick.bind(this);

    this.element.addEventListener('click', this.onQuizClick, true);
    container.appendChild(this.element);
  };

  module.exports = Review;
})();
