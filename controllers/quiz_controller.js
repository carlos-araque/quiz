// GET /question
exports.question = function(req, res, next) {
  var respuesta = req.query.answer || "";
  res.render('quizzes/question', {
    question: 'Capital de Italia',
    respuesta: respuesta
  });
};

//GET check
exports.check = function(req, res, next) {
  var result = req.query.answer === 'Roma' ? 'Correcta' : 'Incorrecta';
  var respuesta = req.query.answer || "";
  res.render('quizzes/result', {
    result: result,
    respuesta: respuesta
  });
};
