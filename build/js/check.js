function getMessage(a, b) {
  var message = "";
  var typeA = typeof(a);
  var typeB = typeof(b);

  switch (typeA) {
    case "boolean":
      if (a) {
        message = "Я попал в " + b;
      } else {
        message = "Я никуда не попал";
      }
      return message;

    case "number":
      message = "Я прыгнул на " + (a * 100) + " сантиметров";
      return message;

    case "object":
      var sum = 0;
      if (Array.isArray(a) && Array.isArray(b)) {
        var countElement = (a.length <= b.length) ? a.length : b.length;
        for (var i = 0; i < countElement; i++) {
          sum += a[i] * b[i];
        }
        message = "Я прошёл " + sum + " метров";
        return message;
      }

      if (Array.isArray(a) && !Array.isArray(b)) {
        for (var i = 0; i < a.length; i++) {
          sum += a[i];
        }
        message = "Я прошёл " + sum + " шагов";
        return message;
      }

      return message;

    default:
      message = "Тип первого параметра не известен";
      return message;
  }
}
