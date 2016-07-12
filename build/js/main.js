/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function() {
	  __webpack_require__(1)();
	  __webpack_require__(10)();
	  __webpack_require__(12)();
	  __webpack_require__(13);
	})();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function() {
	  var utils = __webpack_require__(2);
	  var load = __webpack_require__(3);
	  var ReviewData = __webpack_require__(4);
	  var Review = __webpack_require__(6);
	  var filter = __webpack_require__(9);

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

	  var onMoreReviews = function() {
	    renderReviews(filteredReviews, pageNumber);
	  };

	  /**
	   * @param {isVisible} -
	   */
	  var setMoreReviewsEnabled = function(isVisible) {
	    if (isVisible) {
	      moreReviews.addEventListener('click', onMoreReviews);
	    } else {
	      moreReviews.removeEventListener('click', onMoreReviews);
	    }
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
	      renderedReviews.push(new Review(elementToClone, reviewsList,
	        new ReviewData(review)));
	    });

	    pageNumber++;
	    var showMoreReviews = isNextPageAvailable(reviews, pageNumber,
	      PAGE_SIZE);
	    if (showMoreReviews) {
	      moreReviews.classList.remove('invisible');
	    } else {
	      moreReviews.classList.add('invisible');
	    }
	    setMoreReviewsEnabled(showMoreReviews);
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
	      if (allReviews.length) {
	        setFiltrationEnabled();
	        filter.getCountFilteredReviews(allReviews, formReviewsFilter);
	        setFilter(filter.getDefaultFilter());
	        formReviewsFilter.querySelector('#' +
	          filter.getDefaultFilter()).checked = true;
	      }
	    }, reviewsList);

	    formReviewsFilter.classList.remove('invisible');
	  };

	  module.exports = showReviews;
	})();


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	(function() {

	  var lastCall = Date.now();

	  var EmptyCtor = function() {

	  };

	  module.exports = {

	    /**
	     * @param {HTMLElement} elementTemplate
	     * @param {string} classElementToClone
	     * @return {HTMLElement}
	     */
	    getElementToClone: function(elementTemplate, classElementToClone) {
	      var cloneElement;
	      if ('content' in elementTemplate) {
	        cloneElement = elementTemplate.content.querySelector(
	          classElementToClone);
	      } else { //если браузер не поддерживает тег template
	        cloneElement = elementTemplate.querySelector(classElementToClone);
	      }
	      return cloneElement;
	    },

	    /**
	     * @param {HTMLElement} template
	     * @param {HTMLElement} container
	     * @param {string} text
	     * @return {HTMLElement}
	     */
	    showMessage: function(template, container, text) {
	      container.innerHTML = '';
	      var message = template.cloneNode(true);
	      var messageText = message.querySelector('.notify-message-text');
	      messageText.textContent = text;
	      container.appendChild(message);
	      return message;
	    },

	    /**
	     * @param {function()} method
	     * @param {number} period
	     * @param {Object} scope
	     */
	    throttle: function(method, period, scope) {
	      return function() {
	        var result = false;
	        if (Date.now() - lastCall >= period) {
	          result = method.call(scope);
	          lastCall = Date.now();
	        }
	        return result;
	      };
	    },

	    setLocationHash: function(value) {
	      location.hash = value;
	    },

	    inherit: function(Parent, Child) {
	      EmptyCtor.prototype = Parent.prototype;
	      Child.prototype = new EmptyCtor();
	    }
	  };
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function() {
	  var setEventDataChange = __webpack_require__(5);

	  /**
	   * @param {Object} data
	   * @constructor
	   */
	  var ReviewData = function(data) {
	    this.author = {
	      name: data.author.name,
	      picture: data.author.picture
	    };
	    this.date = data.date;
	    this.reviewUsefulness = data.review_usefulness;
	    this.rating = data.rating;
	    this.description = data.description;
	  };

	  ReviewData.prototype.getAuthorName = function() {
	    return this.author.name;
	  };

	  ReviewData.prototype.getAuthorPhotoSrc = function() {
	    return this.author.picture;
	  };

	  ReviewData.prototype.getReviewDate = function() {
	    return this.date;
	  };

	  ReviewData.prototype.getReviewUsefulness = function() {
	    return this.reviewUsefulness;
	  };

	  ReviewData.prototype.upReviewUsefulness = function() {
	    this.reviewUsefulness = this.reviewUsefulness + 1;
	    setEventDataChange(this);

	  };

	  ReviewData.prototype.downReviewUsefulness = function() {
	    this.reviewUsefulness = this.reviewUsefulness - 1;
	    setEventDataChange(this);
	  };

	  ReviewData.prototype.getReviewText = function() {
	    return this.description;
	  };

	  ReviewData.prototype.getReviewFullDesription = function() {
	    return this.author.name + ' (' + this.date + '): ' +
	      this.description;
	  };

	  ReviewData.prototype.getRating = function() {
	    return this.rating;
	  };

	  module.exports = ReviewData;
	})();


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	(function() {
	  var setEventDataChange = function(sender) {
	    var eventDataChange = new CustomEvent('dataChange', {
	      detail: {
	        sender: sender
	      },
	      bubbles: true,
	      cancelable: false
	    });
	    window.dispatchEvent(eventDataChange);
	  };

	  module.exports = setEventDataChange;
	})();


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function() {

	  var BaseComponent = __webpack_require__(7);
	  var utils = __webpack_require__(2);
	  var ReviewElement = __webpack_require__(8);

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


/***/ },
/* 7 */
/***/ function(module, exports) {

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function() {
	  var BaseComponent = __webpack_require__(7);
	  var utils = __webpack_require__(2);

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


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	(function() {
	  /** @enum {string} */
	  var Filter = {
	    'ALL': 'reviews-all',
	    'RECENT': 'reviews-recent',
	    'GOOD': 'reviews-good',
	    'BAD': 'reviews-bad',
	    'POPULAR': 'reviews-popular'
	  };

	  var LOCAL_STORAGE_FILTER_KEY = 'filter';

	  /** @constant {Filter} */
	  var DEFAULT_FILTER = Filter.ALL;

	  /** @constant {Filter} */
	  var RECENT_DAYS = 4;

	  /** @constant {string} */
	  var CLASS_FILTER_DISABLED = 'reviews-filter-item-disabled';

	  var currentFilter;


	  var setDisabilityEmptyFilter = function(filterElement, disabled) {
	    var filterInput = filterElement.previousElementSibling;
	    filterInput.disabled = disabled;
	    if (disabled) {
	      filterElement.classList.add(CLASS_FILTER_DISABLED);
	    } else {
	      filterElement.classList.remove(CLASS_FILTER_DISABLED);
	    }
	  };

	  var setFilterCountResults = function(filterElement, countResults) {
	    filterElement.innerHTML = filterElement.innerHTML + '<sup> ' +
	      countResults +
	      '</sup>';
	  };

	  var getLastFilter = function(key) {
	    return localStorage.getItem(key);
	  };

	  var setLastFilter = function(key, value) {
	    localStorage.setItem(key, value);
	  };

	  module.exports = {
	    getDefaultFilter: function() {
	      return getLastFilter(LOCAL_STORAGE_FILTER_KEY) || DEFAULT_FILTER;
	    },

	    /**
	     * @param {HTMLElement} containerElement
	     */
	    setFiltersDisabled: function(containerElement) {
	      for (var item in Filter) {
	        if (Filter.hasOwnProperty(item)) {
	          var filterElement = containerElement.querySelector('label[for=' +
	            Filter[item] + ']');
	          setDisabilityEmptyFilter(filterElement, true);
	        }
	      }
	    },

	    /**
	     * @param {Array.<Object>} reviews
	     * @param {string} filter
	     * @param {bool} setFilter
	     */
	    getFilteredReviews: function(reviews, filter, setFilter) {
	      var reviewsToFilter = reviews.slice(0);
	      switch (filter) {
	        case Filter.RECENT:
	          reviewsToFilter = reviewsToFilter.filter(function(review) {
	            var msInDay = 24 * 60 * 60 * 1000;
	            var countDay = Math.ceil((new Date().setHours(0, 0, 0, 0) -
	                new Date(review.date).setHours(0, 0, 0, 0)) /
	              msInDay);
	            return countDay <= RECENT_DAYS;
	          }).sort(function(a, b) {
	            //сортировка по убыванию даты
	            return new Date(b.date).setHours(0, 0, 0, 0) - new Date(a
	                .date)
	              .setHours(
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
	      if (setFilter && currentFilter !== filter) {
	        setLastFilter(LOCAL_STORAGE_FILTER_KEY, filter);
	        currentFilter = filter;
	      }

	      return reviewsToFilter;
	    },

	    /**
	     * @param {Array} reviews
	     * @param {HTMLElement} containerElement
	     */
	    getCountFilteredReviews: function(reviews, containerElement) {
	      var filterSet = false;
	      for (var item in Filter) {
	        if (Filter.hasOwnProperty(item)) {
	          var len = this.getFilteredReviews(reviews, Filter[item],
	              filterSet)
	            .length;
	          var filterElement = containerElement.querySelector('label[for=' +
	            Filter[item] + ']');
	          setFilterCountResults(filterElement, len);
	          setDisabilityEmptyFilter(filterElement, !len);
	        }
	      }
	    }
	  };
	})();


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function() {
	  var browserCookies = __webpack_require__(11);

	  var formContainer = document.querySelector('.overlay-container');
	  var formOpenButton = document.querySelector('.reviews-controls-new');
	  //форма для отправки отзыва
	  var reviewForm = document.querySelector('.review-form');
	  var formCloseButton = reviewForm.querySelector('.review-form-close');
	  //имя
	  var reviewName = reviewForm.querySelector('#review-name');
	  //отзыв
	  var reviewText = reviewForm.querySelector('#review-text');

	  //контейнер с оценками
	  var groupReviewMarks = reviewForm.querySelector('.review-form-group-mark');

	  //коллекция радиобаттонов с оценками
	  var reviewMarks = reviewForm.elements['review-mark'];
	  //текущая оценка
	  var currentMark;
	  //блок с метками-ссылками на незаполненные обязательные поля
	  var requiredFields = reviewForm.querySelector('.review-fields');
	  //метка-"ссылка" на незаполненное обязательное поле Имя
	  var fieldRequiredName = reviewForm.querySelector('.review-fields-name');
	  //метка-"ссылка" на незаполненное обязательное поле Отзыв
	  var fieldRequiredText = reviewForm.querySelector('.review-fields-text');
	  //кнопка Отправить
	  var btnReviewSubmit = reviewForm.querySelector('.review-submit');
	  //объект с набором элементов, сообщающих о невалидности поля
	  var controlsTextWarning = {};

	  //вычислить срок жизни cookies
	  //как количество дней, прошедшее с момента последнего ДР (fromDay.fromMonth.fromYear)
	  var getPeriodToExpireCookie = function() {
	    var currentDate = new Date();
	    var fromDay = 17;
	    var fromMonth = 8; //нумерация месяцев с 0
	    var fromYear = currentDate.getFullYear();
	    var fromDate = new Date(fromYear, fromMonth, fromDay);
	    if (currentDate - fromDate < 0) {
	      fromDate = new Date(fromYear - 1, fromMonth, fromDay);
	    }
	    return currentDate - fromDate;
	  };

	  //сохранить оценку и имя пользователя в cookies
	  var setFormCookies = function(dateToExpire) {
	    browserCookies.set('mark', currentMark, {
	      expires: dateToExpire
	    });
	    browserCookies.set('name', reviewName.value, {
	      expires: dateToExpire
	    });
	  };

	  //создать элемент для сообщения о невалидности поля controlInvalid
	  var createControlTextWarning = function(controlInvalid) {
	    var controlWarning = document.createElement('div');
	    controlWarning.style.position = 'absolute';
	    controlWarning.style.fontSize = '0.7em';
	    controlWarning.style.padding = '3px 5px';
	    controlWarning.style.backgroundColor = 'rgb(184, 40, 50)';
	    controlWarning.style.color = '#FFFFFF';
	    controlInvalid.parentElement.appendChild(controlWarning);
	    controlWarning.classList.add('invisible');
	    controlsTextWarning[controlInvalid.name] = controlWarning;
	  };

	  var removeControlTextWarning = function(controlInvalid) {
	    controlInvalid.parentNode.removeChild(controlInvalid);
	  };

	  //показать сообщение textMessage о невалидности поля controlInvalidName
	  var showMessageValidity = function(controlInvalidName, textMessage) {
	    controlsTextWarning[controlInvalidName].textContent = textMessage;
	    controlsTextWarning[controlInvalidName].classList.remove('invisible');
	  };

	  //скрыть сообщение о невалидности поля
	  var hideMessageValidity = function(controlInvalidName) {
	    controlsTextWarning[controlInvalidName].textContent = '';
	    controlsTextWarning[controlInvalidName].classList.add('invisible');
	  };

	  //управление доступностью кнопки Отправить
	  var setDisabilityBtnReviewSubmit = function() {
	    btnReviewSubmit.disabled = !reviewName.validity.valid ||
	      !reviewText.validity.valid;
	  };

	  //определение валидности контрола
	  var testValidity = function(control) {
	    if (!control.validity.valid) {
	      showMessageValidity(control.name, control.validationMessage);
	    } else {
	      hideMessageValidity(control.name);
	    }
	    setDisabilityBtnReviewSubmit();
	  };

	  //логика назначения полю Отзыв атрибута required
	  var setReviewTextConstraint = function() {
	    reviewText.required = currentMark === '1' ||
	      currentMark === '2';
	  };

	  //управление видимостью метки-"ссылки" на незаполненное поле Отзыв
	  var setVisibilityFieldRequiredText = function() {
	    if (reviewText.required && !reviewText.value) {
	      fieldRequiredText.classList.remove('invisible');
	    } else {
	      fieldRequiredText.classList.add('invisible');
	    }
	    setVisibilityRequiredFields();
	  };

	  //управление видимостью метки-"ссылки" на обязательное незаполненное поле Имя
	  var setVisibilityFieldRequiredName = function() {
	    if (reviewName.value) {
	      fieldRequiredName.classList.add('invisible');
	    } else {
	      fieldRequiredName.classList.remove('invisible');
	    }
	    setVisibilityRequiredFields();
	  };

	  //управление видимостью блока, содержащего метки-"ссылки" на обязательные незаполненные поля
	  var setVisibilityRequiredFields = function() {
	    if (fieldRequiredName.classList.contains('invisible') &&
	      fieldRequiredText.classList.contains('invisible')) {
	      requiredFields.classList.add('invisible');
	    } else {
	      requiredFields.classList.remove('invisible');
	    }
	  };

	  //обработчик изменения оценки
	  var onMarkChange = function(evt) {
	    if (evt.target.name === 'review-mark') {
	      currentMark = evt.target.value;
	      setReviewTextConstraint();
	      setVisibilityFieldRequiredText();
	      testValidity(reviewText);
	    }
	  };

	  var onInputName = function(evt) {
	    setVisibilityFieldRequiredName();
	    testValidity(evt.target);
	  };

	  var onInputText = function(evt) {
	    setVisibilityFieldRequiredText();
	    testValidity(evt.target);
	  };

	  var onSubmit = function() {
	    setFormCookies(new Date(Date.now() + getPeriodToExpireCookie()));
	  };

	  var onClickFormShow = function(evt) {
	    evt.preventDefault();
	    initFormNewReview();
	    formContainer.classList.remove('invisible');
	  };

	  var onCloseClick = function(evt) {
	    evt.preventDefault();
	    removeEventListeners();
	    for (var item in controlsTextWarning) {
	      if (controlsTextWarning.hasOwnProperty(item)) {
	        removeControlTextWarning(controlsTextWarning[item]);
	      }
	    }
	    formContainer.classList.add('invisible');
	  };

	  var setEventListeners = function() {
	    // назначение обработчика события onchange для оценок
	    groupReviewMarks.addEventListener('change', onMarkChange);

	    //назначение обработчика события oninput поля ввода имени пользователя
	    reviewName.addEventListener('input', onInputName);

	    //назначение обработчика события oninput поля ввода отзыва
	    reviewText.addEventListener('input', onInputText);

	    //назначение обработчика события onsubmit для формы
	    reviewForm.addEventListener('submit', onSubmit);

	    //назначение обработчика события onclick для кнопки закрытия формы
	    formCloseButton.addEventListener('click', onCloseClick);
	  };

	  var removeEventListeners = function() {
	    groupReviewMarks.removeEventListener('change', onMarkChange);

	    reviewName.removeEventListener('input', onInputName);

	    reviewText.removeEventListener('input', onInputText);

	    reviewForm.removeEventListener('submit', onSubmit);

	    formCloseButton.removeEventListener('click', onCloseClick);
	  };

	  var initFormNewReview = function() {
	    setEventListeners();

	    //получить имя пользователя из cookies
	    reviewName.value = browserCookies.get('name');
	    reviewName.required = true;

	    //создать элементы для сообщения о невалидности обязательных полей
	    createControlTextWarning(reviewName);
	    createControlTextWarning(reviewText);

	    //получить оценку из cookies
	    currentMark = browserCookies.get('mark') || 5;
	    reviewMarks[currentMark - 1].checked = true;

	    setReviewTextConstraint();
	    setVisibilityFieldRequiredName();
	    setVisibilityFieldRequiredText();
	    testValidity(reviewName);
	    testValidity(reviewText);
	  };

	  var initOnClickFormShow = function() {
	    //назначение обработчика события onclick для кнопки, показавающей форму заполнения отзыва
	    formOpenButton.addEventListener('click', onClickFormShow);
	  };

	  module.exports = initOnClickFormShow;
	})();


/***/ },
/* 11 */
/***/ function(module, exports) {

	exports.defaults = {};

	exports.set = function(name, value, options) {
	  // Retrieve options and defaults
	  var opts = options || {};
	  var defaults = exports.defaults;

	  // Apply default value for unspecified options
	  var expires  = opts.expires || defaults.expires;
	  var domain   = opts.domain  || defaults.domain;
	  var path     = opts.path     != undefined ? opts.path     : (defaults.path != undefined ? defaults.path : '/');
	  var secure   = opts.secure   != undefined ? opts.secure   : defaults.secure;
	  var httponly = opts.httponly != undefined ? opts.httponly : defaults.httponly;

	  // Determine cookie expiration date
	  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
	  var expDate = expires ? new Date(
	      // in case expires is an integer, it should specify the number of days till the cookie expires
	      typeof expires == 'number' ? new Date().getTime() + (expires * 864e5) :
	      // else expires should be either a Date object or in a format recognized by Date.parse()
	      expires
	  ) : '';

	  // Set cookie
	  document.cookie = name.replace(/[^+#$&^`|]/g, encodeURIComponent)                // Encode cookie name
	  .replace('(', '%28')
	  .replace(')', '%29') +
	  '=' + value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +                  // Encode cookie value (RFC6265)
	  (expDate && expDate.getTime() >= 0 ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
	  (domain   ? ';domain=' + domain : '') +                                          // Add domain
	  (path     ? ';path='   + path   : '') +                                          // Add path
	  (secure   ? ';secure'           : '') +                                          // Add secure option
	  (httponly ? ';httponly'         : '');                                           // Add httponly option
	};

	exports.get = function(name) {
	  var cookies = document.cookie.split(';');

	  // Iterate all cookies
	  for(var i = 0; i < cookies.length; i++) {
	    var cookie = cookies[i];
	    var cookieLength = cookie.length;

	    // Determine separator index ("name=value")
	    var separatorIndex = cookie.indexOf('=');

	    // IE<11 emits the equal sign when the cookie value is empty
	    separatorIndex = separatorIndex < 0 ? cookieLength : separatorIndex;

	    // Decode the cookie name and remove any leading/trailing spaces, then compare to the requested cookie name
	    if (decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+|\s+$/g, '')) == name) {
	      return decodeURIComponent(cookie.substring(separatorIndex + 1, cookieLength));
	    }
	  }

	  return null;
	};

	exports.erase = function(name, options) {
	  exports.set(name, '', {
	    expires:  -1,
	    domain:   options && options.domain,
	    path:     options && options.path,
	    secure:   0,
	    httponly: 0}
	  );
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function() {
	  var utils = __webpack_require__(2);

	  /**
	   * @const
	   * @type {number}
	   */
	  var THROTTLE_DELAY = 100;

	  //начало диапазона a в шкале [a; 1]
	  var rangeStart = 0;

	  /**
	   * @const
	   * @type {number}
	   */
	  var HEIGHT = 300;

	  /**
	   * @const
	   * @type {number}
	   */
	  var WIDTH = 700;

	  /**
	   * ID уровней.
	   * @enum {number}
	   */
	  var Level = {
	    'INTRO': 0,
	    'MOVE_LEFT': 1,
	    'MOVE_RIGHT': 2,
	    'LEVITATE': 3,
	    'HIT_THE_MARK': 4
	  };

	  /**
	   * Порядок прохождения уровней.
	   * @type {Array.<Level>}
	   */
	  var LevelSequence = [
	    Level.INTRO
	  ];

	  /**
	   * Начальный уровень.
	   * @type {Level}
	   */
	  var INITIAL_LEVEL = LevelSequence[0];

	  /**
	   * Допустимые виды объектов на карте.
	   * @enum {number}
	   */
	  var ObjectType = {
	    'ME': 0,
	    'FIREBALL': 1
	  };

	  /**
	   * Допустимые состояния объектов.
	   * @enum {number}
	   */
	  var ObjectState = {
	    'OK': 0,
	    'DISPOSED': 1
	  };

	  /**
	   * Коды направлений.
	   * @enum {number}
	   */
	  var Direction = {
	    NULL: 0,
	    LEFT: 1,
	    RIGHT: 2,
	    UP: 4,
	    DOWN: 8
	  };

	  /**
	   * Правила перерисовки объектов в зависимости от состояния игры.
	   * @type {Object.<ObjectType, function(Object, Object, number): Object>}
	   */
	  var ObjectsBehaviour = {};

	  /**
	   * Обновление движения мага. Движение мага зависит от нажатых в данный момент
	   * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
	   * На движение мага влияет его пересечение с препятствиями.
	   * @param {Object} object
	   * @param {Object} state
	   * @param {number} timeframe
	   */
	  ObjectsBehaviour[ObjectType.ME] = function(object, state, timeframe) {
	    // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
	    // в воздухе на определенной высоте.
	    // NB! Сложность заключается в том, что поведение описано в координатах
	    // канваса, а не координатах, относительно нижней границы игры.
	    if (state.keysPressed.UP && object.y > 0) {
	      object.direction = object.direction & ~Direction.DOWN;
	      object.direction = object.direction | Direction.UP;
	      object.y -= object.speed * timeframe * 2;

	      if (object.y < 0) {
	        object.y = 0;
	      }
	    }

	    // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
	    // опускается на землю.
	    if (!state.keysPressed.UP) {
	      if (object.y < HEIGHT - object.height) {
	        object.direction = object.direction & ~Direction.UP;
	        object.direction = object.direction | Direction.DOWN;
	        object.y += object.speed * timeframe / 3;
	      } else {
	        object.Direction = object.direction & ~Direction.DOWN;
	      }
	    }

	    // Если зажата стрелка влево, маг перемещается влево.
	    if (state.keysPressed.LEFT) {
	      object.direction = object.direction & ~Direction.RIGHT;
	      object.direction = object.direction | Direction.LEFT;
	      object.x -= object.speed * timeframe;
	    }

	    // Если зажата стрелка вправо, маг перемещается вправо.
	    if (state.keysPressed.RIGHT) {
	      object.direction = object.direction & ~Direction.LEFT;
	      object.direction = object.direction | Direction.RIGHT;
	      object.x += object.speed * timeframe;
	    }

	    // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
	    if (object.y < 0) {
	      object.y = 0;
	      object.Direction = object.direction & ~Direction.DOWN;
	      object.Direction = object.direction & ~Direction.UP;
	    }

	    if (object.y > HEIGHT - object.height) {
	      object.y = HEIGHT - object.height;
	      object.Direction = object.direction & ~Direction.DOWN;
	      object.Direction = object.direction & ~Direction.UP;
	    }

	    if (object.x < 0) {
	      object.x = 0;
	    }

	    if (object.x > WIDTH - object.width) {
	      object.x = WIDTH - object.width;
	    }
	  };

	  /**
	   * Обновление движения файрбола. Файрбол выпускается в определенном направлении
	   * и после этого неуправляемо движется по прямой в заданном направлении. Если
	   * он пролетает весь экран насквозь, он исчезает.
	   * @param {Object} object
	   * @param {Object} state
	   * @param {number} timeframe
	   */
	  ObjectsBehaviour[ObjectType.FIREBALL] = function(object, state, timeframe) {
	    if (object.direction & Direction.LEFT) {
	      object.x -= object.speed * timeframe;
	    }

	    if (object.direction & Direction.RIGHT) {
	      object.x += object.speed * timeframe;
	    }

	    if (object.x < 0 || object.x > WIDTH) {
	      object.state = ObjectState.DISPOSED;
	    }
	  };

	  /**
	   * ID возможных ответов функций, проверяющих успех прохождения уровня.
	   * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
	   * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
	   * нужно прервать.
	   * @enum {number}
	   */
	  var Verdict = {
	    'CONTINUE': 0,
	    'WIN': 1,
	    'FAIL': 2,
	    'PAUSE': 3,
	    'INTRO': 4
	  };

	  /**
	   * Правила завершения уровня. Ключами служат ID уровней, значениями функции
	   * принимающие на вход состояние уровня и возвращающие true, если раунд
	   * можно завершать или false если нет.
	   * @type {Object.<Level, function(Object):boolean>}
	   */
	  var LevelsRules = {};

	  /**
	   * Уровень считается пройденным, если был выпущен файлболл и он улетел
	   * за экран.
	   * @param {Object} state
	   * @return {Verdict}
	   */
	  LevelsRules[Level.INTRO] = function(state) {
	    var fireballs = state.garbage.filter(function(object) {
	      return object.type === ObjectType.FIREBALL;
	    });

	    return fireballs.length ? Verdict.WIN : Verdict.CONTINUE;
	  };

	  /**
	   * Начальные условия для уровней.
	   * @enum {Object.<Level, function>}
	   */
	  var LevelsInitialize = {};

	  /**
	   * Первый уровень.
	   * @param {Object} state
	   * @return {Object}
	   */
	  LevelsInitialize[Level.INTRO] = function(state) {
	    state.objects.push(
	      // Установка персонажа в начальное положение. Он стоит в крайнем левом
	      // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
	      // уровне равна 2px за кадр.
	      {
	        direction: Direction.RIGHT,
	        height: 84,
	        speed: 2,
	        sprite: 'img/wizard.gif',
	        spriteReversed: 'img/wizard-reversed.gif',
	        state: ObjectState.OK,
	        type: ObjectType.ME,
	        width: 61,
	        x: WIDTH / 3,
	        y: HEIGHT - 100
	      }
	    );

	    return state;
	  };

	  /**
	   * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
	   * и показывает приветственный экран.
	   * @param {Element} container
	   * @constructor
	   */
	  var Game = function(container) {
	    this.container = container;
	    this.canvas = document.createElement('canvas');
	    this.canvas.width = container.clientWidth;
	    this.canvas.height = container.clientHeight;
	    this.container.appendChild(this.canvas);

	    this.ctx = this.canvas.getContext('2d');

	    this._onKeyDown = this._onKeyDown.bind(this);
	    this._onKeyUp = this._onKeyUp.bind(this);
	    this._onscroll = this._onscroll.bind(this);
	    this._pauseListener = this._pauseListener.bind(this);
	  };

	  Game.prototype = {
	    /**
	     * Текущий уровень игры.
	     * @type {Level}
	     */
	    level: INITIAL_LEVEL,

	    /**
	     * Состояние игры. Описывает местоположение всех объектов на игровой карте
	     * и время проведенное на уровне и в игре.
	     * @return {Object}
	     */
	    getInitialState: function() {
	      return {
	        // Статус игры. Если CONTINUE, то игра продолжается.
	        currentStatus: Verdict.CONTINUE,

	        // Объекты, удаленные на последнем кадре.
	        garbage: [],

	        // Время с момента отрисовки предыдущего кадра.
	        lastUpdated: null,

	        // Состояние нажатых клавиш.
	        keysPressed: {
	          ESC: false,
	          LEFT: false,
	          RIGHT: false,
	          SPACE: false,
	          UP: false
	        },

	        // Время начала прохождения уровня.
	        levelStartTime: null,

	        // Все объекты на карте.
	        objects: [],

	        // Время начала прохождения игры.
	        startTime: null
	      };
	    },

	    /**
	     * Начальные проверки и запуск текущего уровня.
	     * @param {Level=} level
	     * @param {boolean=} restart
	     */
	    initializeLevelAndStart: function(level, restart) {
	      level = typeof level === 'undefined' ? this.level : level;
	      restart = typeof restart === 'undefined' ? true : restart;

	      if (restart || !this.state) {
	        // При перезапуске уровня, происходит полная перезапись состояния
	        // игры из изначального состояния.
	        this.state = this.getInitialState();
	        this.state = LevelsInitialize[this.level](this.state);
	      } else {
	        // При продолжении уровня состояние сохраняется, кроме записи о том,
	        // что состояние уровня изменилось с паузы на продолжение игры.
	        this.state.currentStatus = Verdict.CONTINUE;
	      }

	      // Запись времени начала игры и времени начала уровня.
	      this.state.levelStartTime = Date.now();
	      if (!this.state.startTime) {
	        this.state.startTime = this.state.levelStartTime;
	      }

	      this._preloadImagesForLevel(function() {
	        // Предварительная отрисовка игрового экрана.
	        this.render();

	        // Установка обработчиков событий.
	        this._initializeGameListeners();

	        // Запуск игрового цикла.
	        this.update();
	      }.bind(this));
	    },

	    /**
	     * Временная остановка игры.
	     * @param {Verdict=} verdict
	     */
	    pauseLevel: function(verdict) {
	      if (verdict) {
	        this.state.currentStatus = verdict;
	      }

	      this.state.keysPressed.ESC = false;
	      this.state.lastUpdated = null;

	      this._removeGameListeners();
	      window.addEventListener('keydown', this._pauseListener);

	      this._drawPauseScreen();
	    },

	    /**
	     * Обработчик событий клавиатуры во время паузы.
	     * @param {KeyboardsEvent} evt
	     * @private
	     * @private
	     */
	    _pauseListener: function(evt) {
	      if (evt.keyCode === 32) {
	        evt.preventDefault();
	        var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
	          this.state.currentStatus === Verdict.FAIL;
	        this.initializeLevelAndStart(this.level, needToRestartTheGame);

	        window.removeEventListener('keydown', this._pauseListener);
	      }
	    },

	    /**
	     * Нарисовать четырехугольник неправильной формы на canvas
	     * @param {number} x - координата Х левого верхнего угла
	     * @param {number} y - координата Y левого верхнего угла
	     * @param {string} color - цвет заливки четырехугольника
	     * @param {number} widthBlock - ширина четырехугольника
	     * @param {number} heightLeftEdge - высота левой стороны четырехугольника
	     * @param {number} heightRightEdge - высота правой стороны четырехугольника
	     * @private
	     */
	    _drawBlock: function(x, y, color, widthBlock, heightLeftEdge,
	      heightRightEdge) {
	      this.ctx.beginPath();
	      this.ctx.moveTo(x, y);
	      this.ctx.lineTo(x + widthBlock, y);
	      this.ctx.lineTo(x + widthBlock, y +
	        heightRightEdge);
	      this.ctx.lineTo(x, y + heightLeftEdge);
	      this.ctx.lineTo(x, y);
	      this.ctx.closePath();
	      this.ctx.stroke();
	      this.ctx.fillStyle = color;
	      this.ctx.fill();
	    },

	    /**
	     * Получить массив строк, вписываемых в блок заданной ширины, из строки-сообщения
	     * @param {string} message - строка-сообщение
	     * @param {number} widthBlock - ширина блока
	     * @return {[string]}
	     * @private
	     */
	    _getMassiveMessage: function(message, widthBlock) {
	      //количество пикселей на 1 символ
	      var countPixelsSymb = 10;
	      //количество символов в одной строке блока
	      var countSymbRow = Math.floor(widthBlock / countPixelsSymb) - 4;
	      var massiveMessage = [];
	      var words = message.split(' ');
	      if (words.length <= 1) {
	        return [message];
	      }
	      //текущая строка для добавления в массив строк
	      var currentLine = '';
	      for (var i = 0; i < words.length; i++) {
	        //если добавление пробела и нового слова к текущей строке превышает
	        //допустимую длину - в массив строк добавить текущую строку
	        if (currentLine.length + words[i].length + 1 > countSymbRow) {
	          massiveMessage.push(currentLine);
	          //начать формирование новой текущей строки - добавить в нее слово, превысившее лимит
	          currentLine = words[i];
	        } else { //если добавление нового слова к текущей строке не превышает лимит -
	          //продолжаем формировать текущую строку
	          if (currentLine.length === 0) {
	            currentLine = words[i];
	          } else {
	            currentLine = currentLine + ' ' + words[i];
	          }
	          //если после добавления нового слова в текущую строку количество символов в ней = лимиту -
	          //добавляем сформированную строку в массив
	          if (currentLine === countSymbRow) {
	            massiveMessage.push(currentLine);
	            currentLine = '';
	          }
	        }
	      }
	      //добавляем в массив остаток message
	      if (currentLine !== '') {
	        massiveMessage.push(currentLine);
	      }
	      return massiveMessage;
	    },

	    /**
	     * Получить координаты блока с сообщением в зависимости от положения мага
	     * @param {number} widthBlock - ширина блока
	     * @param {number} leftHeightBlock - высота левой стороны блока
	     * @param {number} rightHeightBlock - высота правой стороны блока
	     * @return {Object}
	     * @private
	     */
	    _getLocationMessageBlock: function(widthBlock, leftHeightBlock) {
	      //допустимые размеры области, где может выводиться блок с сообщением
	      var widhtArea = WIDTH;
	      var tree = document.querySelector('.header-tree');
	      if (tree) {
	        widhtArea = WIDTH - Math.floor(tree.clientWidth / 2);
	      }
	      //координаты блока
	      var location = {};
	      //найти мага
	      var me = this.state.objects.filter(function(object) {
	        return object.type === ObjectType.ME;
	      })[0];

	      if (me) {
	        //позиция сообщения по оси Х
	        location.x = me.x + me.width;
	        if (location.x + widthBlock > widhtArea) {
	          location.x = widhtArea - widthBlock;
	        }
	        if (location.x < 0) {
	          location.x = 0;
	        }
	        //позиция сообщения по оси Y
	        location.y = me.y - leftHeightBlock;

	        //минимальное значение по оси Y, чтобы сообщение не обрезалось и не закрывалось
	        if (location.y < 15) { //граница для yStart немного больше 0 из-за частичного наложения header-clouds
	          location.y = 15;
	        }
	        //в случае пересечения мага и сообщения (происходит при коррекции х и у в верхней части экрана)
	        //перенести сообщение под мага (под голову мага)
	        if (((me.x + me.width > location.x && me.x + me.width < location.x +
	              widthBlock) ||
	            (me.x > location.x && me.x < location.x + widthBlock)) &&
	          ((me.y > location.y && me.y < location.y + leftHeightBlock) ||
	            (me.y + me.height > location.y && me.y + me.height < location
	              .y +
	              leftHeightBlock))) {
	          location.y = me.y + Math.floor(me.height / 2) + 20;
	        }
	      } else {
	        location.x = Math.floor(widhtArea / 2) - Math.floor(widthBlock /
	          2);
	        location.y = 30;
	      }
	      return location;
	    },

	    /**
	     * Нарисовать блок сообщения с заданной строкой сообщения
	     * с автоматическим переносом нужных строк
	     * и вычислением высоты четырехугольника в зависимости от высоты текста сообщения
	     * @param {string} strMessage - сообщение
	     * @private
	     */
	    _drawBlockMessage: function(strMessage) {
	      var widthBlock = 340;
	      //отступы для текста от границ четырехугольника
	      var offsetTextX = 15;
	      var offsetTextY = 10;
	      //отступы для блока-тени от блока-сообщения
	      var offsetShadowX = 10;
	      var offsetShadowY = 10;
	      var fontSize = 16;
	      //расстояние между строками по вертикали
	      var distanceRowY = Math.floor(fontSize * 1.3);

	      //из строки получить массив строк, вписывающихся в блок заданной ширины
	      var message = this._getMassiveMessage(strMessage, widthBlock);

	      //рассчитать высоту блока
	      var heightRightEdge = message.length * distanceRowY + offsetTextY *
	        2;
	      var heightLeftEdge = Math.floor(heightRightEdge * 1.2);

	      //получить начальные координаты блока-четырехугольника с сообщением
	      var coordinate = this._getLocationMessageBlock(widthBlock +
	        offsetShadowX, heightLeftEdge + offsetShadowY);

	      //нарисовать блок-тень
	      this._drawBlock(coordinate.x + offsetShadowX, coordinate.y +
	        offsetShadowY, 'rgba(0, 0, 0, 0.7)', widthBlock, heightLeftEdge,
	        heightRightEdge);
	      //нарисовать основной блок
	      this._drawBlock(coordinate.x, coordinate.y, '#FFFFFF',
	        widthBlock, heightLeftEdge, heightRightEdge);

	      //написать текст сообщения
	      this.ctx.font = String(fontSize) + 'px PT Mono';
	      this.ctx.textBaseline = 'hanging';
	      this.ctx.fillStyle = '#000000';
	      for (var i = 0; i < message.length; i++) {
	        this.ctx.fillText(message[i], coordinate.x + offsetTextX,
	          coordinate.y + offsetTextY + i * distanceRowY);
	      }
	    },

	    /**
	     * Отрисовка экрана паузы.
	     */
	    _drawPauseScreen: function() {
	      switch (this.state.currentStatus) {
	        case Verdict.WIN:
	          this._drawBlockMessage(
	            'Ура! Вы выиграли! Поздравляем с победой!');
	          break;
	        case Verdict.FAIL:
	          this._drawBlockMessage(
	            'Игра закончена. Вы проиграли. Не огорчайтесь - попробуйте снова.'
	          );
	          break;
	        case Verdict.PAUSE:
	          this._drawBlockMessage(
	            'Игра на паузе. Для продолжения игры нажмите пробел. Возвращайтесь быстрее.'
	          );
	          break;
	        case Verdict.INTRO:
	          this._drawBlockMessage(
	            'Добро пожаловать в игру! В ней маг может ходить, летать ' +
	            'по нажатию на стрелки и стрелять фаерболом по нажатию на шифт. Нажмите пробел, чтобы начать игру.'
	          );
	          break;
	      }
	    },

	    /**
	     * Предзагрузка необходимых изображений для уровня.
	     * @param {function} callback
	     * @private
	     */
	    _preloadImagesForLevel: function(callback) {
	      if (typeof this._imagesArePreloaded === 'undefined') {
	        this._imagesArePreloaded = [];
	      }

	      if (this._imagesArePreloaded[this.level]) {
	        callback();
	        return;
	      }

	      var levelImages = [];
	      this.state.objects.forEach(function(object) {
	        levelImages.push(object.sprite);

	        if (object.spriteReversed) {
	          levelImages.push(object.spriteReversed);
	        }
	      });

	      var i = levelImages.length;
	      var imagesToGo = levelImages.length;

	      while (i-- > 0) {
	        var image = new Image();
	        image.src = levelImages[i];
	        image.onload = function() {
	          if (--imagesToGo === 0) {
	            this._imagesArePreloaded[this.level] = true;
	            callback();
	          }
	        }.bind(this);
	      }
	    },

	    /**
	     * Обновление статуса объектов на экране. Добавляет объекты, которые должны
	     * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
	     * должны исчезнуть.
	     * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
	     */
	    updateObjects: function(delta) {
	      // Персонаж.
	      var me = this.state.objects.filter(function(object) {
	        return object.type === ObjectType.ME;
	      })[0];

	      // Добавляет на карту файрбол по нажатию на Shift.
	      if (this.state.keysPressed.SHIFT) {
	        this.state.objects.push({
	          direction: me.direction,
	          height: 24,
	          speed: 5,
	          sprite: 'img/fireball.gif',
	          type: ObjectType.FIREBALL,
	          width: 24,
	          x: me.direction & Direction.RIGHT ? me.x + me.width : me.x -
	            24,
	          y: me.y + me.height / 2
	        });

	        this.state.keysPressed.SHIFT = false;
	      }

	      this.state.garbage = [];

	      // Убирает в garbage не используемые на карте объекты.
	      var remainingObjects = this.state.objects.filter(function(object) {
	        ObjectsBehaviour[object.type](object, this.state, delta);

	        if (object.state === ObjectState.DISPOSED) {
	          this.state.garbage.push(object);
	          return false;
	        }

	        return true;
	      }, this);

	      this.state.objects = remainingObjects;
	    },

	    /**
	     * Проверка статуса текущего уровня.
	     */
	    checkStatus: function() {
	      // Нет нужны запускать проверку, нужно ли останавливать уровень, если
	      // заранее известно, что да.
	      if (this.state.currentStatus !== Verdict.CONTINUE) {
	        return;
	      }

	      if (!this.commonRules) {
	        /**
	         * Проверки, не зависящие от уровня, но влияющие на его состояние.
	         * @type {Array.<functions(Object):Verdict>}
	         */
	        this.commonRules = [
	          /**
	           * Если персонаж мертв, игра прекращается.
	           * @param {Object} state
	           * @return {Verdict}
	           */
	          function checkDeath(state) {
	            var me = state.objects.filter(function(object) {
	              return object.type === ObjectType.ME;
	            })[0];

	            return me.state === ObjectState.DISPOSED ?
	              Verdict.FAIL :
	              Verdict.CONTINUE;
	          },

	          /**
	           * Если нажата клавиша Esc игра ставится на паузу.
	           * @param {Object} state
	           * @return {Verdict}
	           */
	          function checkKeys(state) {
	            return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
	          },

	          /**
	           * Игра прекращается если игрок продолжает играть в нее два часа подряд.
	           * @param {Object} state
	           * @return {Verdict}
	           */
	          function checkTime(state) {
	            return Date.now() - state.startTime > 3 * 60 * 1000 ?
	              Verdict.FAIL :
	              Verdict.CONTINUE;
	          }
	        ];
	      }

	      // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
	      // по всем универсальным проверкам и проверкам конкретного уровня.
	      // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
	      // любое другое состояние кроме CONTINUE или пока не пройдут все
	      // проверки. После этого состояние сохраняется.
	      var allChecks = this.commonRules.concat(LevelsRules[this.level]);
	      var currentCheck = Verdict.CONTINUE;
	      var currentRule;

	      while (currentCheck === Verdict.CONTINUE && allChecks.length) {
	        currentRule = allChecks.shift();
	        currentCheck = currentRule(this.state);
	      }

	      this.state.currentStatus = currentCheck;
	    },

	    /**
	     * Принудительная установка состояния игры. Используется для изменения
	     * состояния игры от внешних условий, например, когда необходимо остановить
	     * игру, если она находится вне области видимости и установить вводный
	     * экран.
	     * @param {Verdict} status
	     */
	    setGameStatus: function(status) {
	      if (this.state.currentStatus !== status) {
	        this.state.currentStatus = status;
	      }
	    },

	    /**
	     * Отрисовка всех объектов на экране.
	     */
	    render: function() {
	      // Удаление всех отрисованных на странице элементов.
	      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

	      // Выставление всех элементов, оставшихся в this.state.objects согласно
	      // их координатам и направлению.
	      this.state.objects.forEach(function(object) {
	        if (object.sprite) {
	          var image = new Image(object.width, object.height);
	          image.src = (object.spriteReversed && object.direction &
	              Direction.LEFT) ?
	            object.spriteReversed :
	            object.sprite;
	          this.ctx.drawImage(image, object.x, object.y, object.width,
	            object.height);
	        }
	      }, this);
	    },

	    /**
	     * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
	     * и обновляет их согласно правилам их поведения, а затем запускает
	     * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
	     * проверка не вернет состояние FAIL, WIN или PAUSE.
	     */
	    update: function() {
	      if (!this.state.lastUpdated) {
	        this.state.lastUpdated = Date.now();
	      }

	      var delta = (Date.now() - this.state.lastUpdated) / 10;
	      this.updateObjects(delta);
	      this.checkStatus();

	      switch (this.state.currentStatus) {
	        case Verdict.CONTINUE:
	          this.state.lastUpdated = Date.now();
	          this.render();
	          requestAnimationFrame(function() {
	            this.update();
	          }.bind(this));
	          break;

	        case Verdict.WIN:
	        case Verdict.FAIL:
	        case Verdict.PAUSE:
	        case Verdict.INTRO:
	        default:
	          this.pauseLevel();
	          break;
	      }
	    },

	    /**
	     * @param {KeyboardEvent} evt [description]
	     * @private
	     */
	    _onKeyDown: function(evt) {
	      switch (evt.keyCode) {
	        case 37:
	          this.state.keysPressed.LEFT = true;
	          break;
	        case 39:
	          this.state.keysPressed.RIGHT = true;
	          break;
	        case 38:
	          this.state.keysPressed.UP = true;
	          break;
	        case 27:
	          this.state.keysPressed.ESC = true;
	          break;
	      }

	      if (evt.shiftKey) {
	        this.state.keysPressed.SHIFT = true;
	      }
	    },

	    /**
	     * @param {KeyboardEvent} evt [description]
	     * @private
	     */
	    _onKeyUp: function(evt) {
	      switch (evt.keyCode) {
	        case 37:
	          this.state.keysPressed.LEFT = false;
	          break;
	        case 39:
	          this.state.keysPressed.RIGHT = false;
	          break;
	        case 38:
	          this.state.keysPressed.UP = false;
	          break;
	        case 27:
	          this.state.keysPressed.ESC = false;
	          break;
	      }

	      if (evt.shiftKey) {
	        this.state.keysPressed.SHIFT = false;
	      }
	    },

	    /**
	     * @param {HTMLElement} elem
	     */
	    isVisibleElement: function(element) {
	      var positionElem = element.getBoundingClientRect();
	      return (positionElem.bottom >= 0);
	    },

	    /**
	     * @param {number} scrollTop
	     * @param {HTMLElement} element
	     */
	    changePositionElement: function(scrollY, element) {
	      var maxScroll = element.clientHeight;
	      var backgroundPos =
	        window.getComputedStyle(element).backgroundPosition.split(' ');
	      //позиция a в шкале [a; 1]
	      if (!rangeStart) {
	        rangeStart = parseInt(backgroundPos[0], 10) / 100.0;
	      }
	      //проецирование текущего положения скролла в позицию бэкграунда
	      var xPos = (rangeStart + rangeStart * scrollY / maxScroll) *
	        100;
	      var yPos = parseInt(backgroundPos[1], 10);
	      element.style.backgroundPosition = xPos + '% ' + yPos + '%';
	    },

	    /**
	     * @return {bool}
	     */
	    resetParallax: function() {
	      var result = false;
	      var visibleGame = this.isVisibleElement(document.querySelector(
	        '.demo'));
	      var clouds = document.querySelector('.header-clouds');
	      var visibleClouds = this.isVisibleElement(clouds);
	      if (!visibleGame) {
	        game.setGameStatus(window.Game.Verdict.PAUSE);
	        //установить облака в начальную позицию
	        this.changePositionElement(0, clouds);
	      }
	      result = !visibleGame || !visibleClouds;
	      return result;
	    },

	    optimizedResetParallax: function() {
	      return utils.throttle(this.resetParallax,
	        THROTTLE_DELAY, this)();
	    },

	    /**
	     * @private
	     */
	    _onscroll: function() {
	      if (!this.optimizedResetParallax()) {
	        var currentTop = window.pageYOffset ||
	          document.documentElement.scrollTop;
	        //функция изменения позиции облаков
	        this.changePositionElement(currentTop, document.querySelector(
	          '.header-clouds'));
	      }
	    },

	    /** @private */
	    _initializeGameListeners: function() {
	      window.addEventListener('keydown', this._onKeyDown);
	      window.addEventListener('keyup', this._onKeyUp);
	      window.addEventListener('scroll', this._onscroll);
	    },

	    /** @private */
	    _removeGameListeners: function() {
	      window.removeEventListener('keydown', this._onKeyDown);
	      window.removeEventListener('keyup', this._onKeyUp);
	      window.removeEventListener('scroll', this._onscroll);
	    }
	  };

	  var game;
	  var createGameProcess = function() {
	    window.Game = Game;
	    window.Game.Verdict = Verdict;

	    game = new Game(document.querySelector('.demo'));
	    game.initializeLevelAndStart();
	    game.setGameStatus(window.Game.Verdict.INTRO);
	  };

	  module.exports = createGameProcess;
	})();


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function() {

	  var utils = __webpack_require__(2);
	  var BaseComponent = __webpack_require__(7);
	  var previewPhotos = __webpack_require__(14)();

	  /** @constructor
	   *   @param {HTMLElement} el
	   */
	  var Gallery = function(el) {
	    BaseComponent.call(this, el);

	    this.galleryPreview = document.querySelector('.photogallery');
	    this.imgDOMElement = null;

	    this.galleryPhotos = [];
	    this.indexCurrentPhoto = 0;

	    this.previous = this.element.querySelector(
	      '.overlay-gallery-control-left');
	    this.next = this.element.querySelector(
	      '.overlay-gallery-control-right');
	    this.closeGallery = this.element.querySelector('.overlay-gallery-close');

	    this.PHOTO_LOCATION_HASH = 'photo';
	    this.CLASS_FULLSCREEN_PHOTO = 'fullscreen-image';
	    this.KEY_CODE_ESC = 27;
	    this.KEY_CODE_PREV = 37;
	    this.KEY_CODE_NEXT = 39;

	    this._onPrevPhoto = this._onPrevPhoto.bind(this);
	    this._onNextPhoto = this._onNextPhoto.bind(this);
	    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
	    this._onCloseClick = this._onCloseClick.bind(this);
	    this._onPreviewClick = this._onPreviewClick.bind(this);
	    this._onHashChange = this._onHashChange.bind(this);

	    this.init();
	  };
	  utils.inherit(BaseComponent, Gallery);

	  Gallery.prototype._onPrevPhoto = function() {
	    if (this.indexCurrentPhoto - 1 >= 0) {
	      this.indexCurrentPhoto = this.indexCurrentPhoto - 1;
	    } else {
	      this.indexCurrentPhoto = this.galleryPhotos.length - 1;
	    }
	    utils.setLocationHash(this.PHOTO_LOCATION_HASH + '/' + this.galleryPhotos[
	      this.indexCurrentPhoto]);
	  };

	  Gallery.prototype._onNextPhoto = function() {
	    if (this.indexCurrentPhoto + 1 <= this.galleryPhotos.length - 1) {
	      this.indexCurrentPhoto = this.indexCurrentPhoto + 1;
	    } else {
	      this.indexCurrentPhoto = 0;
	    }
	    utils.setLocationHash(this.PHOTO_LOCATION_HASH + '/' + this.galleryPhotos[
	      this.indexCurrentPhoto]);
	  };

	  /**
	   * @param {KeyboardEvent} evt [description]
	   * @private
	   */
	  Gallery.prototype._onDocumentKeyDown = function(evt) {
	    switch (evt.keyCode) {
	      case this.KEY_CODE_ESC:
	        utils.setLocationHash('');
	        break;
	      case this.KEY_CODE_PREV:
	        this._onPrevPhoto();
	        break;
	      case this.KEY_CODE_NEXT:
	        this._onNextPhoto();
	        break;
	    }
	  };

	  /**
	   * @private
	   */
	  Gallery.prototype._onCloseClick = function() {
	    utils.setLocationHash('');
	  };

	  Gallery.prototype._setEventListeners = function() {
	    this.previous.addEventListener('click', this._onPrevPhoto);
	    this.next.addEventListener('click', this._onNextPhoto);
	    document.addEventListener('keydown', this._onDocumentKeyDown);
	    this.closeGallery.addEventListener('click', this._onCloseClick);
	  };

	  Gallery.prototype._removeEventListeners = function() {
	    this.previous.removeEventListener('click', this._onPrevPhoto);
	    this.next.removeEventListener('click', this._onNextPhoto);
	    document.removeEventListener('keydown', this._onDocumentKeyDown);
	    this.closeGallery.removeEventListener('click', this._onCloseClick);
	  };

	  Gallery.prototype.remove = function() {
	    BaseComponent.prototype.remove.call(this, this.imgDOMElement);
	  };

	  /**
	   * @param {string} src
	   * @param {number}
	   */
	  Gallery.prototype._getNumberPhoto = function(src) {
	    return this.galleryPhotos.indexOf(src);
	  };

	  /**
	   * @param {number/string} pic - индекс фотографии в массиве или путь к фотографии
	   */
	  Gallery.prototype._showPhoto = function(pic) {
	    var photo = new Image();
	    photo.onload = function(evt) {
	      this.imgDOMElement.src = evt.target.src;

	      var width = window.innerWidth;
	      var height = window.innerHeight;

	      this.imgDOMElement.width = width * 0.8;
	      if (this.imgDOMElement.height > 0.8 * height) {
	        this.imgDOMElement.style.width = 'auto';
	        this.imgDOMElement.height = 0.8 * height;
	      }
	    };
	    photo.onload = photo.onload.bind(this);

	    var src = '';

	    if (typeof pic === 'number') {
	      src = this.galleryPhotos[pic];
	      this.indexCurrentPhoto = pic;
	    } else {
	      if (typeof pic === 'string') {
	        src = pic;
	        this.indexCurrentPhoto = this._getNumberPhoto(src);
	      }
	    }

	    if (this.indexCurrentPhoto > -1) {
	      photo.src = src;
	      var numberPhoto = this.element.querySelector(
	        '.preview-number-current');
	      numberPhoto.textContent = this.indexCurrentPhoto + 1;
	    }
	  };

	  /**
	   * @param {number/string} startPhoto
	   */
	  Gallery.prototype.showGallery = function(startPhoto) {
	    if (this.element.classList.contains('invisible')) {
	      this._setEventListeners();
	      this.element.classList.remove('invisible');
	    }
	    this.imgDOMElement = this._getImgElement();
	    this._showPhoto(startPhoto);
	  };

	  Gallery.prototype._hideGallery = function() {
	    if (!this.element.classList.contains('invisible')) {
	      this.remove();
	      this.element.classList.add('invisible');
	    }
	  };

	  Gallery.prototype._restoreFromHash = function() {
	    var hash = location.hash;
	    if (hash === '') {
	      this._hideGallery();
	      return;
	    }
	    var founds = hash.match(/#photo\/(\S+)/);
	    if (founds && founds.length > 1) {
	      var srcPhoto = founds[1];
	      this.showGallery(srcPhoto);
	    }
	  };

	  Gallery.prototype._onHashChange = function() {
	    this._restoreFromHash();
	  };

	  Gallery.prototype._showFullScreenPhoto = function(src) {
	    utils.setLocationHash(this.PHOTO_LOCATION_HASH + '/' + src);
	  };

	  Gallery.prototype._onPreviewClick = function(evt) {
	    evt.preventDefault();
	    if (evt.target.tagName === 'IMG') {
	      var src = evt.target.currentSrc;
	      var tail = src.substr(src.indexOf('\/img\/') + 1);
	      this._showFullScreenPhoto(tail);
	    }
	  };

	  Gallery.prototype._setEventListenerPreviewClick = function() {
	    this.galleryPreview.addEventListener('click', this._onPreviewClick);
	  };

	  Gallery.prototype._setEventListenerHashChange = function() {
	    window.addEventListener('hashchange', this._onHashChange);
	  };

	  /**
	   * @return {HTMLElement}
	   */
	  Gallery.prototype._getImgElement = function() {
	    var image = this.element.querySelector('.' +
	      this.CLASS_FULLSCREEN_PHOTO);
	    if (!image) {
	      var photo = document.createElement('img');
	      var fullScreenPhotoContainer = this.element.querySelector(
	        '.overlay-gallery-preview');
	      photo.className = this.CLASS_FULLSCREEN_PHOTO;
	      image = fullScreenPhotoContainer.appendChild(photo);
	    }
	    return image;
	  };

	  /**
	   * @param {Array.<string>} photos
	   */
	  Gallery.prototype.savePhotos = function(photos) {
	    this.galleryPhotos = photos;
	    var previewCount = this.element.querySelector(
	      '.preview-number-total');
	    previewCount.textContent = photos.length;
	  };

	  Gallery.prototype.init = function() {
	    this.savePhotos(previewPhotos);
	    this._setEventListenerPreviewClick();
	    this._setEventListenerHashChange();
	    this._restoreFromHash();
	  };

	  module.exports = new Gallery(document.querySelector('.overlay-gallery'));
	})();


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	(function() {
	  var getPhotos = function() {
	    var galleryPreview = document.querySelector('.photogallery');
	    var previews = galleryPreview.querySelectorAll(
	      '.photogallery-image img');
	    var previewPhotos = [];
	    for (var i = 0; i < previews.length; i++) {
	      var src = previews[i].src;
	      previewPhotos.push(src.substr(src.indexOf('\/img\/') + 1));
	    }
	    return previewPhotos;
	  };

	  module.exports = getPhotos;
	})();


/***/ }
/******/ ]);