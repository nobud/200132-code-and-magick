'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  //форма для отправки отзыва
  var reviewForm = document.querySelector('.review-form');
  var formCloseButton = reviewForm.querySelector('.review-form-close');
  //имя
  var reviewName = reviewForm.querySelector('#review-name');
  //отзыв
  var reviewText = reviewForm.querySelector('#review-text');
  //массив радиобаттонов с оценками
  var reviewMarks = reviewForm.elements['review-mark'];
  var currentMark = reviewMarks.value;
  //блок с метками-ссылками на незаполненные обязательные поля
  var requiredFields = reviewForm.querySelector('.review-fields');
  //метка-"ссылка" на незаполненное обязательное поле Имя
  var fieldRequiredName = reviewForm.querySelector('.review-fields-name');
  //метка-"ссылка" на незаполненное обязательное поле Отзыв
  var fieldRequiredText = reviewForm.querySelector('.review-fields-text');
  //кнопка Отправить
  var btnReviewSubmit = reviewForm.querySelector('.review-submit');
  //объект с набором элементов, сообщающих о невалидности поля
  var controlsTextWarning = {};

  //создать элемент для сообщения о невалидности поля controlInvalid
  var createControlTextWarning = function(controlInvalid) {
    var controlWarning = document.createElement('div');
    controlWarning.style.position = 'absolute';
    controlWarning.style.fontSize = '0.7em';
    controlWarning.style.padding = '3px 5px';
    controlWarning.style.backgroundColor = 'rgb(184, 40, 50)';
    controlWarning.style.color = '#FFFFFF';
    controlInvalid.parentElement.appendChild(controlWarning);
    controlWarning.classList.add('invisible');
    controlsTextWarning[controlInvalid.name] = controlWarning;
  };

  createControlTextWarning(reviewName);
  createControlTextWarning(reviewText);

  //показать сообщение textMessage о невалидности поля controlInvalidName
  var showMessageValidity = function(controlInvalidName, textMessage) {
    controlsTextWarning[controlInvalidName].textContent = textMessage;
    controlsTextWarning[controlInvalidName].classList.remove('invisible');
  };

  //скрыть сообщение о невалидности поля
  var hideMessageValidity = function(controlInvalidName) {
    controlsTextWarning[controlInvalidName].textContent = '';
    controlsTextWarning[controlInvalidName].classList.add('invisible');
  };

  //управление доступностью кнопки Отправить
  var setDisabilityBtnReviewSubmit = function() {
    btnReviewSubmit.disabled = !reviewName.validity.valid ||
      !reviewText.validity.valid;
  };

  //определение валидности контрола
  var testValidity = function(control) {
    if (!control.validity.valid) {
      showMessageValidity(control.name, control.validationMessage);
    } else {
      hideMessageValidity(control.name);
    }
    setDisabilityBtnReviewSubmit();
  };

  //логика назначения полю Отзыв атрибута required
  var setReviewTextConstraint = function() {
    reviewText.required = currentMark === '1' ||
      currentMark === '2';
  };

  //управление видимостью метки-"ссылки" на незаполненное поле Отзыв
  var setVisibilityFieldRequiredText = function() {
    if (reviewText.required && !reviewText.value) {
      fieldRequiredText.classList.remove('invisible');
    } else {
      fieldRequiredText.classList.add('invisible');
    }
    setVisibilityRequiredFields();
  };

  //управление видимостью метки-"ссылки" на обязательное незаполненное поле Имя
  var setVisibilityFieldRequiredName = function() {
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
  };

  //обработчик изменения оценки
  var changeMark = function() {
    currentMark = reviewMarks.value;
    setReviewTextConstraint();
    setVisibilityFieldRequiredText();
    testValidity(reviewText);
  };

  reviewName.required = true;

  //назначение обработчика события onchange для оценок
  for (var i = 0; i < reviewMarks.length; i++) {
    reviewMarks[i].onchange = changeMark;
  }

  reviewName.oninput = function() {
    setVisibilityFieldRequiredName();
    testValidity(this);
  };

  reviewText.oninput = function() {
    setVisibilityFieldRequiredText();
    testValidity(this);
  };

  setReviewTextConstraint();
  setVisibilityFieldRequiredName();
  setVisibilityFieldRequiredText();
  testValidity(reviewName);
  testValidity(reviewText);

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };
})();
