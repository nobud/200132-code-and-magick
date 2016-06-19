'use strict';
var formReviewsFilter = document.querySelector('.reviews-filter');
var reviewsList = document.querySelector('.reviews-list');
var templateElement = document.querySelector('#review-template');
var templateMessage = document.querySelector('#empty-filter-results-template');
var moreReviews = document.querySelector('.reviews-controls-more');
var elementToClone;
var messageToClone;
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
var allReviews = [];

/** @type {Array.<Object>} */
var filteredReviews = [];

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

/** @constant {string} */
var NOTIFY_EMPTY_FILTER_TEXT =
  'Нет отзывов, подходящих под выбранные критерии фильтрации';

/** @constant {string} */
var CLASS_FILTER_DISABLED = 'reviews-filter-item-disabled';

/** @constant {string} */
var CLASS_REVIEW_LOADING = 'reviews-list-loading';

/** @constant {string} */
var CLASS_REVIEW_LOAD_FAILURE = 'review-load-failure';

/** @constant {number}*/
var PAGE_SIZE = 3;

/** @type {number}*/
var pageNumber = 0;

/**
 * @param {HTMLElement} elementTemplate
 * @param {string} classElementToClone
 * @return {HTMLElement}
 */
var getElementToClone = function(elementTemplate, classElementToClone) {
  var cloneElement;
  if ('content' in templateElement) {
    cloneElement = elementTemplate.content.querySelector(
      classElementToClone);
  } else { //если браузер не поддерживает тег template
    cloneElement = elementTemplate.querySelector(classElementToClone);
  }
  return cloneElement;
};

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
    element.classList.add(CLASS_REVIEW_LOAD_FAILURE);
    console.log('error loading image: ' + this.src);
  };
  authorImage.src = data.author.picture;
  imageLoadTimeout = setTimeout(function() {
    authorImage.src = '';
    element.classList.add(CLASS_REVIEW_LOAD_FAILURE);
  }, LOAD_TIMEOUT);
  reviewText.textContent = data.author.name + ' (' + data.date + '): ' +
    data.description;
  reviewQuiz.innerHTML = '(' + data.review_usefulness +
    ')' + reviewQuiz.innerHTML;
  container.appendChild(element);
  return element;
};

var notifyErrorLoadingReviews = function() {
  reviewsList.classList.remove(CLASS_REVIEW_LOADING);
  reviewsList.classList.add(CLASS_REVIEW_LOAD_FAILURE);
};

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

/** @param {function(Array.<Object>)} callback */
var getReviews = function(callback) {
  var xhr = new XMLHttpRequest();
  /** @param {ProgressEvent} */
  xhr.onload = function(evt) {
    if (evt.target.status === 200) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
      reviewsList.classList.remove(CLASS_REVIEW_LOADING);
    } else {
      notifyErrorLoadingReviews();
    }
  };
  xhr.timeout = LOAD_TIMEOUT;
  xhr.ontimeout = xhr.onerror = function() {
    notifyErrorLoadingReviews();
  };
  reviewsList.classList.add(CLASS_REVIEW_LOADING);
  xhr.open('GET', REVIEWS_LOAD_URL);
  xhr.send();
};

/**
 * @param {Array.<Object>} reviews
 * @param {number} page - нумерация страниц с 0
 * @param {boolean} reset - признак перезаписи содержимого контейнера
 */
var renderReviews = function(reviews, page, reset) {
  if (reset) {
    pageNumber = 0;
    clearListReview();
  }
  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  reviews.slice(from, to).forEach(function(review) {
    getReviewElement(review, reviewsList);
  });

  pageNumber++;
  if (isNextPageAvailable(reviews, pageNumber, PAGE_SIZE)) {
    moreReviews.classList.remove('invisible');
  } else {
    moreReviews.classList.add('invisible');
  }
};

/**
 * @param {Array.<Object>} reviews
 * @param {HTMLElement} container
 * @param {string} text
 * @return {HTMLElement}
 */
var showMessage = function(container, text) {
  container.innerHTML = '';
  var message = messageToClone.cloneNode(true);
  var messageText = message.querySelector('.notify-message-text');
  messageText.textContent = text;
  container.appendChild(message);
  return message;
};

/**
 * @param {Array.<Object>} reviews
 * @param {string} filter
 */
var getFilteredReviews = function(reviews, filter) {
  var reviewsToFilter = reviews.slice(0);
  switch (filter) {
    case Filter.RECENT:
      reviewsToFilter = reviewsToFilter.filter(function(review) {
        var msInDay = 24 * 60 * 60 * 1000;
        var countDay = Math.ceil((new Date().setHours(0, 0, 0, 0) -
          new Date(review.date).setHours(0, 0, 0, 0)) / msInDay);
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

var setDisabilityEmptyFilter = function(filterElement, disabled) {
  var filterInput = filterElement.previousElementSibling;
  filterInput.disabled = disabled;
  if (disabled) {
    filterElement.classList.add(CLASS_FILTER_DISABLED);
  } else {
    filterElement.classList.remove(CLASS_FILTER_DISABLED);
  }
};

var getCountFilteredReviews = function() {
  for (var item in Filter) {
    if (Filter.hasOwnProperty(item)) {
      var len = getFilteredReviews(allReviews, Filter[item]).length;
      var filterElement = formReviewsFilter.querySelector('label[for=' +
        Filter[item] + ']');
      filterElement.innerHTML = filterElement.innerHTML + '<sup> ' + len +
        '</sup>';
      if (!len) {
        setDisabilityEmptyFilter(filterElement, true);
      }
    }
  }
};

var clearListReview = function() {
  reviewsList.innerHTML = '';
};

/** обработчик изменения фильтра
 * @param {string} filter
 */
var setFilter = function(filter) {
  filteredReviews = getFilteredReviews(allReviews, filter);
  if (filteredReviews.length) {
    pageNumber = 0;
    renderReviews(filteredReviews, pageNumber, true);
  } else { //если ни один элемент из списка не подходит под выбранные критерии фильтрации
    showMessage(reviewsList, NOTIFY_EMPTY_FILTER_TEXT);
  }
};

/** установить обработчик изменения фильтра
 * @param {boolean} enabled
 */
var setFiltrationEnabled = function() {
  formReviewsFilter.addEventListener('click', function(evt) {
    if (evt.target.name === 'reviews') {
      setFilter(evt.target.id);
    }
  });
};

elementToClone = getElementToClone(templateElement, '.review');
messageToClone = getElementToClone(templateMessage, '.notify-message');

formReviewsFilter.classList.add('invisible');

getReviews(function(loadedReviews) {
  allReviews = loadedReviews;
  setFiltrationEnabled(true);
  if (allReviews.length) {
    setFilter(DEFAULT_FILTER);
    formReviewsFilter.querySelector('#' + DEFAULT_FILTER).checked =
      true;
    setMoreReviewsEnabled();
  }
  getCountFilteredReviews();
});

formReviewsFilter.classList.remove('invisible');
