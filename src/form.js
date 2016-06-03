'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  //имя
  var reviewName = document.querySelector('#review-name');
  //отзыв
  var reviewText = document.querySelector('#review-text');
  //массив радиобаттонов с оценками
  var reviewMark = document.getElementsByName('review-mark');
  //метка-"ссылка" на незаполненное обязательное поле Имя
  var fieldRequiredName = document.querySelector('.review-fields-name');
  //метка-"ссылка" на незаполненное обязательное поле Отзыв
  var fieldRequiredText = document.querySelector('.review-fields-text');
  //блок с метками-"ссылками" на незаполненные обязательные поля
  var requiredFields = document.querySelector('.review-fields');
  //кнопка Отправить
  var btnReviewSubmit = document.querySelector('.review-submit');

  //логика назначения полю Отзыв атрибута required
  var setReviewTextConstraint = function(flagSetRequired) {
    if (flagSetRequired) {
      reviewText.required = true;
    } else {
      reviewText.required = false;
    }
  };

  //управление видимостью метки-"ссылки" на незаполненное поле Отзыв
  var setVisibilityfieldRequiredText = function() {
    if (reviewText.required && !reviewText.value) {
      fieldRequiredText.classList.remove('invisible');
    } else {
      fieldRequiredText.classList.add('invisible');
    }
    setVisibilityRequiredFields();
  };

  //управление видимостью метки-"ссылки" на обязательное незаполненное поле Имя
  var setVisibilityfieldRequiredName = function() {
    if (reviewName.value) {
      fieldRequiredName.classList.add('invisible');
    } else {
      fieldRequiredName.classList.remove('invisible');
    }
    setVisibilityRequiredFields();
  };

  //управление видимостью блока, содержащего метки-"ссылки" на обязательные незаполненные поля
  var setVisibilityRequiredFields = function() {
    if (fieldRequiredName.classList.contains('invisible') &&
      fieldRequiredText.classList.contains('invisible')) {
      requiredFields.classList.add('invisible');
    } else {
      requiredFields.classList.remove('invisible');
    }
    setDisabilityBtnReviewSubmit();
  };

  //управление доступностью кнопки Отправить
  var setDisabilityBtnReviewSubmit = function() {
    if (requiredFields.classList.contains('invisible')) {
      btnReviewSubmit.disabled = false;
    } else {
      btnReviewSubmit.disabled = true;
    }
  };

  reviewName.required = true;

  //назначение события onchange для оценок
  for (var i = 0; i < reviewMark.length; i++) {
    reviewMark[i].onchange = function(evt) {
      setReviewTextConstraint(evt.currentTarget.value === '1' || evt.currentTarget
        .value === '2');
      setVisibilityfieldRequiredText();
    };
  }

  reviewName.oninput = function() {
    setVisibilityfieldRequiredName();
  };

  reviewText.oninput = function() {
    setVisibilityfieldRequiredText();
  };

  setReviewTextConstraint(reviewMark[0].checked || reviewMark[1].checked);
  setVisibilityfieldRequiredName();
  setVisibilityfieldRequiredText();
  setVisibilityfieldRequiredText();

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };
})();
