function getMessage(a, b) {
  var message = "";
  var typeA = typeof(a);
  var typeB = typeof(b);

  switch (typeA) {
    case "boolean":
      if (a)
        message = "Я попал в " + b;
      else
        message = "Я никуда не попал";
      break;

    case "number":
      message = "Я прыгнул на " + (a * 100) + " сантиметров";
      break;

    case "object":
      var sum = 0;
      if (Array.isArray(a)) {
        if (Array.isArray(b)) {
          var countElement = 0;
          if (a.length < b.length)
            countElement = a.length;
          else
            countElement = b.length;
          for (var i = 0; i < countElement; i++) {
            sum += a[i] * b[i];
          }
          message = "Я прошёл " + sum + " метров";
        } else {
          for (var i = 0; i < a.length; i++) {
            sum += a[i];
          }
          message = "Я прошёл " + sum + " шагов";
        }
      }
      break;
    default:
      message = "Тип первого параметра не известен";
  }
  return message;
}
