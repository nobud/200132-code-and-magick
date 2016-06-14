'use strict';
var formReviewsFilter = document.querySelector('.reviews-filter');
formReviewsFilter.classList.add('invisible');
var sectionReviews = document.querySelector('.reviews');
var reviewsList = document.querySelector('.reviews-list');
var templateElement = document.querySelector('#review-template');
var elementToClone;
var ratingClasses = {
  '1': 'review-rating',
  '2': 'review-rating-two',
  '3': 'review-rating-three',
  '4': 'review-rating-four',
  '5': 'review-rating-five'
};

/** @constant {number} */
var LOAD_TIMEOUT = 10000;

/** @constant {string} */
var REVIEWS_LOAD_URL = 'http://o0.github.io/assets/json/reviews.json';

/** @type {Array.<Object>} */
var pageReviews = [];

/** @enum {number} */
var Filter = {
  'ALL': 'reviews-all',
  'RECENT': 'reviews-recent',
  'GOOD': 'reviews-good',
  'BAD': 'reviews-bad',
  'POPULAR': 'reviews-popular'
};

/** @constant {Filter} */
var DEFAULT_FILTER = Filter.ALL;

/** @constant {Filter} */
var RECENT_DAYS = 4;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else { //если браузер не поддерживает тег template
  elementToClone = templateElement.querySelector('.review');
}

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getReviewElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
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
    element.classList.add('review-load-failure');
    console.log('error loading image: ' + this.src);
  };

  authorImage.src = data.author.picture;

  imageLoadTimeout = setTimeout(function() {
    authorImage.src = '';
    element.classList.add('review-load-failure');
  }, LOAD_TIMEOUT);

  reviewText.textContent = data.author.name + ' (' + data.date + '): ' +
    data.description;
  reviewQuiz.innerHTML = '(' + data.review_usefulness +
    ')' + reviewQuiz.innerHTML;
  container.appendChild(element);
  return element;
};

var notifyErrorLoadingReviews = function() {
  sectionReviews.classList.remove('reviews-list-loading');
  sectionReviews.classList.add('reviews-load-failure');
};

/** @param {function(Array.<Object>)} callback */
var getReviews = function(callback) {
  var xhr = new XMLHttpRequest();
  /** @param {ProgressEvent} */
  xhr.onload = function(evt) {
    if (xhr.status === 200) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
      sectionReviews.classList.remove('reviews-list-loading');
    } else {
      notifyErrorLoadingReviews();
    }

  };
  xhr.timeout = LOAD_TIMEOUT;
  xhr.ontimeout = xhr.onerror = function() {
    notifyErrorLoadingReviews();
  };

  sectionReviews.classList.add('reviews-list-loading');
  xhr.open('GET', REVIEWS_LOAD_URL);
  xhr.send();
};

/** @param {Array.<Object>} reviews */
var renderReviews = function(reviews) {
  reviewsList.innerHTML = '';

  reviews.forEach(function(review) {
    getReviewElement(review, reviewsList);
  });
};

/**
 * @param {Array.<Object>} hotels
 * @param {string} filter
 */
var getFilteredReviews = function(reviews, filter) {
  var reviewsToFilter = reviews.slice(0);

  switch (filter) {
    case Filter.RECENT:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        var msInDay = 24 * 60 * 60 * 1000;
        var countDay = Math.ceil((new Date().setHours(0, 0, 0, 0) - new Date(
          review.date).setHours(0, 0, 0, 0)) / msInDay);
        return countDay <= RECENT_DAYS;
      }).sort(function(a, b) {
        //сортировка по убыванию даты
        return new Date(b.date).setHours(0, 0, 0, 0) - new Date(a.date).setHours(
          0, 0, 0, 0);
      });
      break;
    case Filter.GOOD:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return review.rating >= 3;
      }).sort(function(a, b) {
        //сортировка по убыванию рейтинга
        return b.rating - a.rating;
      });
      break;
    case Filter.BAD:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        return review.rating <= 2;
      }).sort(function(a, b) {
        //сортировка по возрастанию рейтинга
        return a.rating - b.rating;
      });
      break;
    case Filter.POPULAR:
      reviewsToFilter = reviewsToFilter.sort(function(a, b) {
        //сортировка по убыванию оценки пользы отзыва
        return b.review_usefulness - a.review_usefulness;
      });
      break;
    case Filter.ALL: //показать список отзывов в том виде, в каком он был загружен
    default:
      break;
  }

  return reviewsToFilter;
};

/** @param {string} filter */
var setFilterEnabled = function(filter) {
  var filteredReviews = getFilteredReviews(pageReviews, filter);
  renderReviews(filteredReviews);
};

/** @param {boolean} enabled */
var setFiltrationEnabled = function(enabled) {
  //массив фильтров отзывов
  var filters = formReviewsFilter.elements['reviews'];
  for (var i = 0; i < filters.length; i++) {
    filters[i].onchange = enabled ? function() {
      setFilterEnabled(this.id);
    } : null;
  }
};

formReviewsFilter.querySelector('#' + DEFAULT_FILTER).checked = true;

getReviews(function(loadedReviews) {
  pageReviews = loadedReviews;
  setFiltrationEnabled(true);
  setFilterEnabled(DEFAULT_FILTER);
});

formReviewsFilter.classList.remove('invisible');
