'use strict';

(function() {
  /** @constructor */
  var Gallery = function() {
    var utils = require('./utils');
    var previewPhotos = require('./gallery-preview')();
    var galleryPreview = document.querySelector('.photogallery');
    var imgDOMElement;

    this.element = document.querySelector('.overlay-gallery');
    this.galleryPhotos = [];
    this.indexCurrentPhoto = 0;

    var previous = this.element.querySelector(
      '.overlay-gallery-control-left');
    var next = this.element.querySelector(
      '.overlay-gallery-control-right');
    var closeGallery = this.element.querySelector('.overlay-gallery-close');
    var fullScreenPhotoContainer = this.element.querySelector(
      '.overlay-gallery-preview');

    var PHOTO_LOCATION_HASH = 'photo';
    var CLASS_FULLSCREEN_PHOTO = 'fullscreen-image';
    var KEY_CODE_ESC = 27;
    var KEY_CODE_PREV = 37;
    var KEY_CODE_NEXT = 39;

    Gallery.prototype._onPrevPhoto = function() {
      if (this.indexCurrentPhoto - 1 >= 0) {
        this.indexCurrentPhoto = this.indexCurrentPhoto - 1;
      } else {
        this.indexCurrentPhoto = this.galleryPhotos.length - 1;
      }
      utils.setLocationHash(PHOTO_LOCATION_HASH + '/' + this.galleryPhotos[
        this.indexCurrentPhoto]);
    };

    Gallery.prototype._onNextPhoto = function() {
      if (this.indexCurrentPhoto + 1 <= this.galleryPhotos.length - 1) {
        this.indexCurrentPhoto = this.indexCurrentPhoto + 1;
      } else {
        this.indexCurrentPhoto = 0;
      }
      utils.setLocationHash(PHOTO_LOCATION_HASH + '/' + this.galleryPhotos[
        this.indexCurrentPhoto]);
    };

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    Gallery.prototype._onDocumentKeyDown = function(evt) {
      switch (evt.keyCode) {
        case KEY_CODE_ESC:
          utils.setLocationHash('');
          break;
        case KEY_CODE_PREV:
          this._onPrevPhoto();
          break;
        case KEY_CODE_NEXT:
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

    Gallery.prototype._addEventListenersGallery = function() {
      previous.addEventListener('click', this._onPrevPhoto);
      next.addEventListener('click', this._onNextPhoto);
      document.addEventListener('keydown', this._onDocumentKeyDown);
      closeGallery.addEventListener('click', this._onCloseClick);
    };

    Gallery.prototype._deleteEventListenersGallery = function() {
      previous.removeEventListener('click', this._onPrevPhoto);
      next.removeEventListener('click', this._onNextPhoto);
      document.removeEventListener('keydown', this._onDocumentKeyDown);
      closeGallery.removeEventListener('click', this._onCloseClick);
    };

    Gallery.prototype._hideGallery = function() {
      if (!this.element.classList.contains('invisible')) {
        this._deleteEventListenersGallery();
        this.element.classList.add('invisible');
      }
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
        imgDOMElement.src = evt.target.src;

        var width = window.innerWidth;
        var height = window.innerHeight;

        imgDOMElement.width = width * 0.8;
        if (imgDOMElement.height > 0.8 * height) {
          imgDOMElement.style.width = 'auto';
          imgDOMElement.height = 0.8 * height;
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
      utils.setLocationHash(PHOTO_LOCATION_HASH + '/' + src);
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
      galleryPreview.addEventListener('click', this._onPreviewClick);
    };

    Gallery.prototype._setEventListenerHashChange = function() {
      window.addEventListener('hashchange', this._onHashChange);
    };

    /**
     * @return {HTMLElement}
     */
    Gallery.prototype._getImgElement = function() {
      var image = this.element.querySelector('.' +
        CLASS_FULLSCREEN_PHOTO);
      if (!image) {
        var photo = document.createElement('img');
        photo.className = CLASS_FULLSCREEN_PHOTO;
        image = fullScreenPhotoContainer.appendChild(photo);
      }
      return image;
    };

    /**
     * @param {number/string} startPhoto
     */
    Gallery.prototype.showGallery = function(startPhoto) {
      if (this.element.classList.contains('invisible')) {
        this._addEventListenersGallery();
        this.element.classList.remove('invisible');
      }
      this._showPhoto(startPhoto);
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

    Gallery.prototype.initGallery = function() {
      imgDOMElement = this._getImgElement();
      this.savePhotos(previewPhotos);
      this._setEventListenerPreviewClick();
      this._setEventListenerHashChange();
      this._restoreFromHash();
    };

    this._onPrevPhoto = this._onPrevPhoto.bind(this);
    this._onNextPhoto = this._onNextPhoto.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onPreviewClick = this._onPreviewClick.bind(this);
    this._onHashChange = this._onHashChange.bind(this);
  };

  module.exports = new Gallery();
})();
