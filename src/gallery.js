'use strict';

(function() {
  /** @constructor */
  var Gallery = function() {
    var utils = require('./utils');
    var previewPhotos = require('./gallery-preview')();
    var galleryPreview = document.querySelector('.photogallery');

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

    var PHOTO_LOCATION_HASH = 'photo';
    var CLASS_FULLSCREEN_PHOTO = 'fullscreen-image';
    var KEY_CODE_ESC = 27;
    var KEY_CODE_PREV = 37;
    var KEY_CODE_NEXT = 39;

    this._prevPhoto = function() {
      if (indexCurrentPhoto - 1 >= 0) {
        indexCurrentPhoto = indexCurrentPhoto - 1;
      } else {
        indexCurrentPhoto = galleryPhotos.length - 1;
      }
      utils.setLocationHash(PHOTO_LOCATION_HASH + '/' + galleryPhotos[
        indexCurrentPhoto]);
    };

    this._nextPhoto = function() {
      if (indexCurrentPhoto + 1 <= galleryPhotos.length - 1) {
        indexCurrentPhoto = indexCurrentPhoto + 1;
      } else {
        indexCurrentPhoto = 0;
      }
      utils.setLocationHash(PHOTO_LOCATION_HASH + '/' + galleryPhotos[
        indexCurrentPhoto]);
    };

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    this._onDocumentKeyDown = function(evt) {
      switch (evt.keyCode) {
        case KEY_CODE_ESC:
          utils.setLocationHash('');
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
      utils.setLocationHash('');
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
      if (!self.element.classList.contains('invisible')) {
        self._deleteEventListeners();
        self.element.classList.add('invisible');
      }
    };

    /**
     * @param {string} src
     * @param {number}
     */
    this._getNumberPhoto = function(src) {
      return galleryPhotos.indexOf(src);
    };

    /**
     * @param {number/string} pic
     */
    this._showPhoto = function(pic) {
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

      var src = '';

      if (typeof pic === 'number') {
        src = galleryPhotos[pic];
        indexCurrentPhoto = pic;
      } else {
        if (typeof pic === 'string') {
          src = pic;
          indexCurrentPhoto = self._getNumberPhoto(src);
        }
      }

      if (indexCurrentPhoto > -1) {
        photo.src = src;
        var numberPhoto = self.element.querySelector(
          '.preview-number-current');
        numberPhoto.textContent = indexCurrentPhoto + 1;
      }
    };

    this._restoreFromHash = function() {
      var hash = location.hash;
      if (hash === '') {
        self._hideGallery();
        return;
      }
      var founds = hash.match(/#photo\/(\S+)/);
      if (founds && founds.length > 1) {
        var srcPhoto = founds[1];
        self.showGallery(srcPhoto);
      }
    };

    this._onHashChange = function() {
      self._restoreFromHash();
    };

    this._showFullScreenPhoto = function(src) {
      utils.setLocationHash(PHOTO_LOCATION_HASH + '/' + src);
    };

    this._previewClick = function(evt) {
      evt.preventDefault();
      if (evt.target.tagName === 'IMG') {
        var src = evt.target.currentSrc;
        var tail = src.substr(src.indexOf('\/img\/') + 1);
        self._showFullScreenPhoto(tail);
      }
    };

    this._setEventListenerPreviewClick = function() {
      galleryPreview.addEventListener('click', self._previewClick);
    };

    /**
     * @param {number/string} startPhoto
     */
    this.showGallery = function(startPhoto) {
      if (self.element.classList.contains('invisible')) {
        self._addEventListeners();
        var image = self.element.querySelector('.' +
          CLASS_FULLSCREEN_PHOTO);
        if (!image) {
          var photo = document.createElement('img');
          photo.className = CLASS_FULLSCREEN_PHOTO;
          fullScreenPhotoContainer.appendChild(photo);
        }
        self.element.classList.remove('invisible');
      }
      self._showPhoto(startPhoto);
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

    this.initGallery = function() {
      self.savePhotos(previewPhotos);
      self._setEventListenerPreviewClick();
      window.addEventListener('hashchange', self._onHashChange);
      self._restoreFromHash();
    };
  };

  module.exports = new Gallery();
})();
