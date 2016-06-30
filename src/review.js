'use strict';

(function() {
  /** @enum {string} */
  var ratingClasses = {
    '1': 'review-rating',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  /** @constant {number} */
  var LOAD_IMAGE_TIMEOUT = 10000;

  /** @constant {string} */
  var CLASS_REVIEW_LOAD_FAILURE = 'review-load-failure';

  /**
   * @param {HTMLElement} element
   */
  var errorLoadingReview = function(element) {
    element.classList.add(CLASS_REVIEW_LOAD_FAILURE);
  };

  /**
   * @param {Object} data
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  var getReviewElement = function(data, container, templateToClone) {
    var element = templateToClone.cloneNode(true);
    var rating = element.querySelector('.review-rating');
    rating.classList.add(ratingClasses[data.rating]);
    var reviewText = element.querySelector('.review-text');
    var reviewQuiz = element.querySelector('.review-quiz');
    var imgDOMElement = element.querySelector('img.review-author');
    var authorImage = new Image();
    var imageLoadTimeout;
    authorImage.onload = function(evt) {
      clearTimeout(imageLoadTimeout);
      imgDOMElement.src = evt.target.src;
      imgDOMElement.width = 124;
      imgDOMElement.height = 124;
      imgDOMElement.title = data.author.name;
    };
    authorImage.onerror = function() {
      errorLoadingReview(element);
      console.log('error loading image: ' + this.src);
    };
    authorImage.src = data.author.picture;
    imageLoadTimeout = setTimeout(function() {
      authorImage.src = '';
      errorLoadingReview(element);
    }, LOAD_IMAGE_TIMEOUT);
    reviewText.textContent = data.author.name + ' (' + data.date + '): ' +
      data.description;
    reviewQuiz.innerHTML = '(' + data.review_usefulness +
      ')' + reviewQuiz.innerHTML;
    return element;
  };

  /**
   * @param {Object} data
   * @param {Element} container
   * @constructor
   */
  var Review = function(data, container, templateToClone) {
    this.data = data;
    this.element = getReviewElement(this.data, container, templateToClone);
    //var quizAnswer = element.querySelector('.review-quiz-answer');

    this.onQuizClick = function(evt) {
      var e = evt.target;
      if (e.classList.contains('review-quiz-answer')) {
        e.classList.add('review-quiz-answer-active');
      }
    };

    this.remove = function() {
      this.element.removeEventListener('click', this.onQuizClick);
      this.element.parentNode.removeChild(this.element);
    };

    this.element.addEventListener('click', this.onQuizClick, true);
    container.appendChild(this.element);
  };

  module.exports = Review;
})();
