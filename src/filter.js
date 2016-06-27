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

  /** @constant {Filter} */
  var DEFAULT_FILTER = Filter.ALL;

  /** @constant {Filter} */
  var RECENT_DAYS = 4;

  /** @constant {string} */
  var CLASS_FILTER_DISABLED = 'reviews-filter-item-disabled';


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

  module.exports = {
    getDefaultFilter: function() {
      return DEFAULT_FILTER;
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
     */
    getFilteredReviews: function(reviews, filter) {
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
      return reviewsToFilter;
    },

    /**
     * @param {Array} reviews
     * @param {HTMLElement} containerElement
     */
    getCountFilteredReviews: function(reviews, containerElement) {
      for (var item in Filter) {
        if (Filter.hasOwnProperty(item)) {
          var len = this.getFilteredReviews(reviews, Filter[item]).length;
          var filterElement = containerElement.querySelector('label[for=' +
            Filter[item] + ']');
          setFilterCountResults(filterElement, len);
          setDisabilityEmptyFilter(filterElement, !len);
        }
      }
    }
  };
})();
