'use strict';
var reviewsFilter = document.querySelector('.reviews-filter');
reviewsFilter.classList.add('invisible');
var reviewsList = document.querySelector('.reviews-list');
var templateElement = document.querySelector('#review-template');
var elementToClone;
var ratingClasses = ['review-rating', 'review-rating-two',
  'review-rating-three', 'review-rating-four', 'review-rating-five'
];

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else { //если браузер не поддерживает тег template
  elementToClone = templateElement.querySelector('.review');
}

/** @constant {number} */
var IMAGE_LOAD_TIMEOUT = 10000;

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getReviewElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  var rating = element.querySelector('.review-rating');
  rating.classList.add(ratingClasses[data.rating - 1]);

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
  }, IMAGE_LOAD_TIMEOUT);

  element.querySelector('.review-text').textContent = data.description;
  container.appendChild(element);
  return element;
};

window.reviews.forEach(function(review) {
  getReviewElement(review, reviewsList);
});

reviewsFilter.classList.remove('invisible');
