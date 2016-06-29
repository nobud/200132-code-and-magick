'use strict';

(function() {
  var galleryPhotos = [];
  var indexCurrentPhoto = 0;
  var gallery = document.querySelector('.overlay-gallery');
  var previous = gallery.querySelector(
    '.overlay-gallery-control-left');
  var next = gallery.querySelector(
    '.overlay-gallery-control-right');
  var closeGallary = gallery.querySelector('.overlay-gallery-close');
  var fullScreenPhotoContainer = gallery.querySelector(
    '.overlay-gallery-preview');
  var CLASS_FULLSCREEN_PHOTO = 'fullscreen-image';
  var KEY_CODE_ESC = 27;

  /**
   * @param {number} index
   */
  var showPhoto = function(index) {
    var photo = new Image();

    photo.onload = function(evt) {
      var image = gallery.querySelector('.' + CLASS_FULLSCREEN_PHOTO);
      image.src = evt.target.src;

      var width = window.innerWidth;
      var height = window.innerHeight;

      image.width = width * 0.8;
      if (image.height > 0.8 * height) {
        image.style.width = 'auto';
        image.height = 0.8 * height;
      }
    };

    photo.src = galleryPhotos[index];

    var numberPhoto = gallery.querySelector('.preview-number-current');
    numberPhoto.textContent = index + 1;
  };

  /**
   * @private
   */
  var _prevPhoto = function() {
    if (indexCurrentPhoto - 1 >= 0) {
      indexCurrentPhoto -= indexCurrentPhoto;
    } else {
      indexCurrentPhoto = galleryPhotos.length - 1;
    }
    showPhoto(indexCurrentPhoto);
  };

  /**
   * @private
   */
  var _nextPhoto = function() {
    if (indexCurrentPhoto + 1 <= galleryPhotos.length - 1) {
      indexCurrentPhoto = indexCurrentPhoto + 1;
    } else {
      indexCurrentPhoto = 0;
    }
    showPhoto(indexCurrentPhoto);
  };

  /**
   * @param {KeyboardEvent} evt [description]
   * @private
   */
  var _onGallaryKeyDown = function(evt) {
    if (evt.keyCode === KEY_CODE_ESC) {
      hideGallery();
    }
  };

  /**
   * @private
   */
  var _onCloseClick = function() {
    hideGallery();
  };

  var addEventListeners = function() {
    previous.addEventListener('click', _prevPhoto);
    next.addEventListener('click', _nextPhoto);
    gallery.addEventListener('keydown', _onGallaryKeyDown);
    closeGallary.addEventListener('click', _onCloseClick);
  };

  var deleteEventListeners = function() {
    previous.removeEventListener('click', _prevPhoto);
    next.removeEventListener('click', _nextPhoto);
    gallery.removeEventListener('keydown', _onGallaryKeyDown);
    closeGallary.removeEventListener('click', _onCloseClick);
  };

  var hideGallery = function() {
    deleteEventListeners();
    gallery.classList.add('invisible');
  };

  module.exports = {
    /**
     * @param {number} startIndexPhoto
     */
    showGallery: function(startIndexPhoto) {
      addEventListeners();
      indexCurrentPhoto = startIndexPhoto;
      var image = gallery.querySelector('.' + CLASS_FULLSCREEN_PHOTO);
      if (!image) {
        var photo = document.createElement('img');
        photo.className = CLASS_FULLSCREEN_PHOTO;
        fullScreenPhotoContainer.appendChild(photo);
      }
      showPhoto(startIndexPhoto);
      gallery.classList.remove('invisible');
    },

    /**
     * @param {Array.<string>} photos
     */
    savePhotos: function(photos) {
      galleryPhotos = photos;
      var previewCount = gallery.querySelector('.preview-number-total');
      previewCount.textContent = photos.length;
    }
  };

})();
