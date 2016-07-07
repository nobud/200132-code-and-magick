'use strict';

(function() {
  var BaseComponent = require('./base');
  var utils = require('./utils');

  var ReviewElement = function(templateToClone, container, data) {
    BaseComponent.call(this, templateToClone, container);

    this.data = data;

    /** @enum {string} */
    this.ratingClasses = {
      '1': 'review-rating',
      '2': 'review-rating-two',
      '3': 'review-rating-three',
      '4': 'review-rating-four',
      '5': 'review-rating-five'
    };

    /** @constant {number} */
    this.LOAD_IMAGE_TIMEOUT = 10000;

    /** @constant {string} */
    this.CLASS_REVIEW_LOAD_FAILURE = 'review-load-failure';

    this.reviewQuiz = null;

    this.reviewUsefulness = null;

    this.getReviewElement();
  };
  utils.inherit(BaseComponent, ReviewElement);

  /**
   * @param {HTMLElement} element
   */
  ReviewElement.prototype.errorLoadingReview = function(element) {
    element.classList.add(this.CLASS_REVIEW_LOAD_FAILURE);
  };

  /**
   * @param {HTMLElement} element
   * @param {Image} authorImage
   */
  ReviewElement.prototype.errorLoadingReviewOnTimeOut = function(element,
    authorImage) {
    authorImage.src = '';
    this.errorLoadingReview(element);
  };

  ReviewElement.prototype.getUsefulness = function() {
    this.reviewUsefulness.textContent = '(' + this.data.getReviewUsefulness() +
      ')';
  };

  ReviewElement.prototype.quizUpdate = function() {
    this.getUsefulness();
    this.activate();
  };

  ReviewElement.prototype.activate = function() {
    this.reviewQuiz.classList.add('review-quiz-answer-active');
    var answers = this.reviewQuiz.parentElement.querySelectorAll(
      '.review-quiz-answer');
    Array.prototype.forEach.call(answers, function(item) {
      item.classList.add('review-quiz-answer-active');
    });
  };

  ReviewElement.prototype.isYes = function(elem) {
    return elem.classList.contains('review-quiz-answer-yes');
  };

  ReviewElement.prototype.isNot = function(elem) {
    return elem.classList.contains('review-quiz-answer-no');
  };

  /**
   * @param {Object} data
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  ReviewElement.prototype.getReviewElement = function() {
    var element = this.element.cloneNode(true);
    this.reviewQuiz = element.querySelector('.review-quiz');
    var rating = element.querySelector('.review-rating');
    var reviewText = element.querySelector('.review-text');
    var imgDOMElement = element.querySelector('img.review-author');
    var authorImage = new Image();
    var imageLoadTimeout;

    authorImage.onload = function(evt) {
      clearTimeout(imageLoadTimeout);
      imgDOMElement.src = evt.target.src;
      imgDOMElement.width = 124;
      imgDOMElement.height = 124;
      imgDOMElement.title = this.data.getAuthorName();
    };
    authorImage.onload = authorImage.onload.bind(this);

    authorImage.onerror = function() {
      clearTimeout(imageLoadTimeout);
      this.errorLoadingReview(element);
    };
    authorImage.onerror = authorImage.onerror.bind(this);

    authorImage.src = this.data.getAuthorPhotoSrc();

    var onTimeOut = function() {
      this.errorLoadingReviewOnTimeOut(element, authorImage);
    };
    imageLoadTimeout = setTimeout(onTimeOut, this.LOAD_IMAGE_TIMEOUT);

    rating.classList.add(this.ratingClasses[this.data.getRating()]);
    reviewText.textContent = this.data.getReviewText();

    this.reviewUsefulness = document.createElement('span');
    this.reviewUsefulness.className = 'review-usefulness';
    this.getUsefulness();
    this.reviewQuiz.insertBefore(this.reviewUsefulness, this.reviewQuiz.firstChild);

    this.element = element;
  };

  module.exports = ReviewElement;
})();
