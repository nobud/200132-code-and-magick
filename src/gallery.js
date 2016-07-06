'use strict';

(function() {

  var utils = require('./utils');
  var BaseComponent = require('./base');
  var previewPhotos = require('./gallery-preview')();

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
