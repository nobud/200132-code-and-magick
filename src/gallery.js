'use strict';

(function() {
  /** @constructor */
  var Gallery = function() {
    var self = this;

    this.element = document.querySelector('.overlay-gallery');

    var previous = this.element.querySelector(
      '.overlay-gallery-control-left');
    var next = this.element.querySelector(
      '.overlay-gallery-control-right');
    var closeGallery = this.element.querySelector('.overlay-gallery-close');
    var fullScreenPhotoContainer = this.element.querySelector(
      '.overlay-gallery-preview');

    var galleryPhotos = [];
    var indexCurrentPhoto = 0;

    var CLASS_FULLSCREEN_PHOTO = 'fullscreen-image';
    var KEY_CODE_ESC = 27;
    var KEY_CODE_PREV = 37;
    var KEY_CODE_NEXT = 39;

    /**
     * @param {number} index
     */
    this._showPhoto = function(index) {
      var photo = new Image();

      photo.onload = function(evt) {
        var image = self.element.querySelector('.' +
          CLASS_FULLSCREEN_PHOTO);
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
      var numberPhoto = self.element.querySelector(
        '.preview-number-current');
      numberPhoto.textContent = index + 1;
    };

    this._prevPhoto = function() {
      if (indexCurrentPhoto - 1 >= 0) {
        indexCurrentPhoto = indexCurrentPhoto - 1;
      } else {
        indexCurrentPhoto = galleryPhotos.length - 1;
      }
      self._showPhoto(indexCurrentPhoto);
    };

    this._nextPhoto = function() {
      if (indexCurrentPhoto + 1 <= galleryPhotos.length - 1) {
        indexCurrentPhoto = indexCurrentPhoto + 1;
      } else {
        indexCurrentPhoto = 0;
      }
      self._showPhoto(indexCurrentPhoto);
    };

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    this._onDocumentKeyDown = function(evt) {
      switch (evt.keyCode) {
        case KEY_CODE_ESC:
          self._hideGallery();
          break;
        case KEY_CODE_PREV:
          self._prevPhoto();
          break;
        case KEY_CODE_NEXT:
          self._nextPhoto();
          break;
      }
    };

    /**
     * @private
     */
    this._onCloseClick = function() {
      self._hideGallery();
    };

    this._addEventListeners = function() {
      previous.addEventListener('click', self._prevPhoto);
      next.addEventListener('click', self._nextPhoto);
      document.addEventListener('keydown', self._onDocumentKeyDown);
      closeGallery.addEventListener('click', self._onCloseClick);
    };

    this._deleteEventListeners = function() {
      previous.removeEventListener('click', self._prevPhoto);
      next.removeEventListener('click', self._nextPhoto);
      document.removeEventListener('keydown', self._onDocumentKeyDown);
      closeGallery.removeEventListener('click', self._onCloseClick);
    };

    this._hideGallery = function() {
      self._deleteEventListeners();
      self.element.classList.add('invisible');
    };

    /**
     * @param {number} startIndexPhoto
     */
    this.showGallery = function(startIndexPhoto) {
      self._addEventListeners();
      indexCurrentPhoto = startIndexPhoto;
      var image = self.element.querySelector('.' + CLASS_FULLSCREEN_PHOTO);
      if (!image) {
        var photo = document.createElement('img');
        photo.className = CLASS_FULLSCREEN_PHOTO;
        fullScreenPhotoContainer.appendChild(photo);
      }
      self._showPhoto(startIndexPhoto);
      self.element.classList.remove('invisible');
    };

    /**
     * @param {Array.<string>} photos
     */
    this.savePhotos = function(photos) {
      galleryPhotos = photos;
      var previewCount = self.element.querySelector(
        '.preview-number-total');
      previewCount.textContent = photos.length;
    };
  };

  module.exports = new Gallery();
})();
