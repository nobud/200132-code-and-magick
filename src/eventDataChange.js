'use strict';

(function() {
  var setEventDataChange = function(sender) {
    var eventDataChange = new CustomEvent('dataChange', {
      detail: {
        sender: sender
      },
      bubbles: true,
      cancelable: false
    });
    window.dispatchEvent(eventDataChange);
  };

  module.exports = setEventDataChange;
})();
