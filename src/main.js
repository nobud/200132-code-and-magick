'use strict';

(function() {
  require('./reviews')();
  require('./form')();
  require('./game')();
  var gallery = require('./gallery');
  var previewPhotos = require('./gallery-preview')();

  var galleryPreview = document.querySelector('.photogallery');

  // обработчик клика по превью фотографии в блоке фотогалереи
  var showFullScreenPhoto = function(evt) {
    if (evt.target.tagName === 'IMG') {
      var index = previewPhotos.indexOf(evt.target.currentSrc);
      gallery.showGallery(index);
    }
  };

  var setEventListenerPreviewClick = function() {
    galleryPreview.addEventListener('click', showFullScreenPhoto);
  };

  setEventListenerPreviewClick();
  gallery.savePhotos(previewPhotos);
})();
