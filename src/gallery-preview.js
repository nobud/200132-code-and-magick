'use strict';

(function() {
  var getPhotos = function() {
    var galleryPreview = document.querySelector('.photogallery');
    var previews = galleryPreview.querySelectorAll(
      '.photogallery-image img');
    var previewPhotos = [];
    for (var i = 0; i < previews.length; i++) {
      previewPhotos.push(previews[i].src);
    }
    return previewPhotos;
  };

  module.exports = getPhotos;
})();
