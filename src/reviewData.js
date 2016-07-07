'use strict';

(function() {
  var setEventDataChange = require('./eventDataChange');

  /**
   * @param {Object} data
   * @constructor
   */
  var ReviewData = function(data) {
    this.author = {
      name: data.author.name,
      picture: data.author.picture
    };
    this.date = data.date;
    this.reviewUsefulness = data.review_usefulness;
    this.rating = data.rating;
    this.description = data.description;
  };

  ReviewData.prototype.getAuthorName = function() {
    return this.author.name;
  };

  ReviewData.prototype.getAuthorPhotoSrc = function() {
    return this.author.picture;
  };

  ReviewData.prototype.getReviewDate = function() {
    return this.date;
  };

  ReviewData.prototype.getReviewUsefulness = function() {
    return this.reviewUsefulness;
  };

  ReviewData.prototype.upReviewUsefulness = function() {
    this.reviewUsefulness = this.reviewUsefulness + 1;
    setEventDataChange(this);

  };

  ReviewData.prototype.downReviewUsefulness = function() {
    this.reviewUsefulness = this.reviewUsefulness - 1;
    setEventDataChange(this);
  };

  ReviewData.prototype.getReviewText = function() {
    return this.description;
  };

  ReviewData.prototype.getReviewFullDesription = function() {
    return this.author.name + ' (' + this.date + '): ' +
      this.description;
  };

  ReviewData.prototype.getRating = function() {
    return this.rating;
  };

  module.exports = ReviewData;
})();
