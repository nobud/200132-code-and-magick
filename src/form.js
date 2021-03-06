'use strict';

(function() {
  var browserCookies = require('browser-cookies');

  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  //форма для отправки отзыва
  var reviewForm = document.querySelector('.review-form');
  var formCloseButton = reviewForm.querySelector('.review-form-close');
  //имя
  var reviewName = reviewForm.querySelector('#review-name');
  //отзыв
  var reviewText = reviewForm.querySelector('#review-text');

  //контейнер с оценками
  var groupReviewMarks = reviewForm.querySelector('.review-form-group-mark');

  //коллекция радиобаттонов с оценками
  var reviewMarks = reviewForm.elements['review-mark'];
  //текущая оценка
  var currentMark;
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

  //вычислить срок жизни cookies
  //как количество дней, прошедшее с момента последнего ДР (fromDay.fromMonth.fromYear)
  var getPeriodToExpireCookie = function() {
    var currentDate = new Date();
    var fromDay = 17;
    var fromMonth = 8; //нумерация месяцев с 0
    var fromYear = currentDate.getFullYear();
    var fromDate = new Date(fromYear, fromMonth, fromDay);
    if (currentDate - fromDate < 0) {
      fromDate = new Date(fromYear - 1, fromMonth, fromDay);
    }
    return currentDate - fromDate;
  };

  //сохранить оценку и имя пользователя в cookies
  var setFormCookies = function(dateToExpire) {
    browserCookies.set('mark', currentMark, {
      expires: dateToExpire
    });
    browserCookies.set('name', reviewName.value, {
      expires: dateToExpire
    });
  };

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

  var removeControlTextWarning = function(controlInvalid) {
    controlInvalid.parentNode.removeChild(controlInvalid);
  };

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
  var onMarkChange = function(evt) {
    if (evt.target.name === 'review-mark') {
      currentMark = evt.target.value;
      setReviewTextConstraint();
      setVisibilityFieldRequiredText();
      testValidity(reviewText);
    }
  };

  var onInputName = function(evt) {
    setVisibilityFieldRequiredName();
    testValidity(evt.target);
  };

  var onInputText = function(evt) {
    setVisibilityFieldRequiredText();
    testValidity(evt.target);
  };

  var onSubmit = function() {
    setFormCookies(new Date(Date.now() + getPeriodToExpireCookie()));
  };

  var onClickFormShow = function(evt) {
    evt.preventDefault();
    initFormNewReview();
    formContainer.classList.remove('invisible');
  };

  var onCloseClick = function(evt) {
    evt.preventDefault();
    removeEventListeners();
    for (var item in controlsTextWarning) {
      if (controlsTextWarning.hasOwnProperty(item)) {
        removeControlTextWarning(controlsTextWarning[item]);
      }
    }
    formContainer.classList.add('invisible');
  };

  var setEventListeners = function() {
    // назначение обработчика события onchange для оценок
    groupReviewMarks.addEventListener('change', onMarkChange);

    //назначение обработчика события oninput поля ввода имени пользователя
    reviewName.addEventListener('input', onInputName);

    //назначение обработчика события oninput поля ввода отзыва
    reviewText.addEventListener('input', onInputText);

    //назначение обработчика события onsubmit для формы
    reviewForm.addEventListener('submit', onSubmit);

    //назначение обработчика события onclick для кнопки закрытия формы
    formCloseButton.addEventListener('click', onCloseClick);
  };

  var removeEventListeners = function() {
    groupReviewMarks.removeEventListener('change', onMarkChange);

    reviewName.removeEventListener('input', onInputName);

    reviewText.removeEventListener('input', onInputText);

    reviewForm.removeEventListener('submit', onSubmit);

    formCloseButton.removeEventListener('click', onCloseClick);
  };

  var initFormNewReview = function() {
    setEventListeners();

    //получить имя пользователя из cookies
    reviewName.value = browserCookies.get('name');
    reviewName.required = true;

    //создать элементы для сообщения о невалидности обязательных полей
    createControlTextWarning(reviewName);
    createControlTextWarning(reviewText);

    //получить оценку из cookies
    currentMark = browserCookies.get('mark') || 5;
    reviewMarks[currentMark - 1].checked = true;

    setReviewTextConstraint();
    setVisibilityFieldRequiredName();
    setVisibilityFieldRequiredText();
    testValidity(reviewName);
    testValidity(reviewText);
  };

  var initOnClickFormShow = function() {
    //назначение обработчика события onclick для кнопки, показавающей форму заполнения отзыва
    formOpenButton.addEventListener('click', onClickFormShow);
  };

  module.exports = initOnClickFormShow;
})();
