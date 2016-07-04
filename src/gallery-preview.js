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
