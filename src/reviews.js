'use strict';

(function() {
  var utils = require('./utils');
  var load = require('./load');
  var Review = require('./review');
  var filter = require('./filter');

  /** @type {HTMLElement} */
  var formReviewsFilter = document.querySelector('.reviews-filter');

  /** @type {HTMLElement} */
  var reviewsList = document.querySelector('.reviews-list');

  /** @type {HTMLElement} */
  var templateMessage = document.querySelector(
    '#empty-filter-results-template');

  /** @type {HTMLElement} */
  var moreReviews = document.querySelector('.reviews-controls-more');

  /** @type {HTMLElement} */
  var elementToClone;

  /** @type {HTMLElement} */
  var messageToClone;

  /** @type {Array.<Object>} */
  var allReviews = [];

  /** @type {Array.<Object>} */
  var filteredReviews = [];

  /** @type {Array.<Object>} */
  var renderedReviews = [];

  /** @constant {number}*/
  var PAGE_SIZE = 3;

  /** @type {number}*/
  var pageNumber = 0;

  /** @constant {string} */
  var NOTIFY_EMPTY_FILTER_TEXT =
    'Нет отзывов, подходящих под выбранные критерии фильтрации';

  //проверка: доступна ли следующая страница
  /**
   * @param {Array} reviews
   * @param {number} page
   * @param {number} pageSize
   * @return {boolean}
   */
  var isNextPageAvailable = function(reviews, page, pageSize) {
    return page < Math.ceil(reviews.length / pageSize);
  };

  var setMoreReviewsEnabled = function() {
    moreReviews.addEventListener('click', function() {
      renderReviews(filteredReviews, pageNumber);
    });
  };

  /**
   * @param {Array.<Object>} reviews
   * @param {number} page - нумерация страниц с 0
   * @param {boolean} reset - признак перезаписи содержимого контейнера
   */
  var renderReviews = function(reviews, page, reset) {
    if (reset) {
      pageNumber = 0;
      renderedReviews.forEach(function(review) {
        review.remove();
      });
      renderedReviews = [];
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    reviews.slice(from, to).forEach(function(review) {
      renderedReviews.push(new Review(review, reviewsList,
        elementToClone));
    });

    pageNumber++;
    if (isNextPageAvailable(reviews, pageNumber, PAGE_SIZE)) {
      moreReviews.classList.remove('invisible');
    } else {
      moreReviews.classList.add('invisible');
    }
  };

  /** обработчик изменения фильтра
   * @param {string} filter
   */
  var setFilter = function(currentFilter) {
    var filterSet = true;
    filteredReviews = filter.getFilteredReviews(allReviews, currentFilter,
      filterSet);
    if (filteredReviews.length) {
      pageNumber = 0;
      renderReviews(filteredReviews, pageNumber, true);
    } else { //если ни один элемент из списка не подходит под выбранные критерии фильтрации
      utils.showMessage(messageToClone, reviewsList,
        NOTIFY_EMPTY_FILTER_TEXT);
    }
  };

  // установить обработчик изменения фильтра
  var setFiltrationEnabled = function() {
    formReviewsFilter.addEventListener('click', function(evt) {
      if (evt.target.name === 'reviews') {
        setFilter(evt.target.id);
      }
    });
  };

  //отрисовать отзывы
  var showReviews = function() {
    var templateElement = document.querySelector('#review-template');
    elementToClone = utils.getElementToClone(templateElement, '.review');
    messageToClone = utils.getElementToClone(templateMessage,
      '.notify-message');

    formReviewsFilter.classList.add('invisible');
    filter.setFiltersDisabled(formReviewsFilter);

    load(function(loadedReviews) {
      allReviews = loadedReviews;
      setFiltrationEnabled(true);
      if (allReviews.length) {
        filter.getCountFilteredReviews(allReviews, formReviewsFilter);
        setFilter(filter.getDefaultFilter());
        formReviewsFilter.querySelector('#' +
          filter.getDefaultFilter()).checked = true;
        setMoreReviewsEnabled();
      }
    }, reviewsList);

    formReviewsFilter.classList.remove('invisible');
  };

  module.exports = showReviews;
})();
