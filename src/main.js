'use strict';

(function() {
  require('./reviews')();
  require('./form')();
  require('./game')();
  var gallery = require('./gallery');

  var init = function() {
    gallery.initGallery();
  };

  init();
})();
