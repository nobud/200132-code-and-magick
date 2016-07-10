'use strict';

(function() {

  /** @constant {number} */
  var LOAD_TIMEOUT = 10000;

  /** @constant {string} */
  var REVIEWS_LOAD_URL = 'https://o0.github.io/assets/json/reviews.json';

  /** @constant {string} */
  var CLASS_REVIEW_LIST_LOADING = 'reviews-list-loading';

  /** @constant {string} */
  var CLASS_REVIEW_LIST_LOAD_FAILURE = 'reviews-load-failure';

  /**
   * @param {HTMLElement} element
   */
  var loadingReviewList = function(element) {
    element.classList.add(CLASS_REVIEW_LIST_LOADING);
  };

  /**
   * @param {HTMLElement} element
   */
  var endLoadingReviewList = function(element) {
    element.classList.remove(CLASS_REVIEW_LIST_LOADING);
  };

  /**
   * @param {HTMLElement} element
   */
  var errorLoadingReviewList = function(element) {
    element.classList.remove(CLASS_REVIEW_LIST_LOADING);
    element.classList.add(CLASS_REVIEW_LIST_LOAD_FAILURE);
  };

  /** @param {function(Array.<Object>)} callback */
  var getReviews = function(callback, container) {
    var xhr = new XMLHttpRequest();
    /** @param {ProgressEvent} */
    xhr.onload = function(evt) {
      if (evt.target.status === 200) {
        var loadedData = JSON.parse(evt.target.response);
        callback(loadedData);
        endLoadingReviewList(container);
        this.loadedResult = true;
      } else {
        errorLoadingReviewList(container);
      }
    };
    xhr.timeout = LOAD_TIMEOUT;
    xhr.ontimeout = xhr.onerror = function() {
      errorLoadingReviewList(container);
    };
    loadingReviewList(container);
    xhr.open('GET', REVIEWS_LOAD_URL);
    xhr.send();
  };

  module.exports = getReviews;
})();
