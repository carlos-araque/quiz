var models = require('../models')

// GET /quizzes
exports.index = function(req, res, next) {
  models.Quiz.findAll().then(function(quizzes) {
    res.render('quizzes/index.ejs', {
      quizzes : quizzes
    });
  }).catch(function(error){
    next(error);
  });
};

// GET /quizzes/:id
exports.show = function(req, res, next) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    if (quiz) {
      var answer = req.query.answer || '';
      res.render('quizzes/question',{
        quiz : quiz,
        answer : answer
      });
    }
    else {
      throw new Error('No existe ese quiz en la Base de Datos');
    }
  }).catch(function(error) {
    next(error);
  });
};

//GET check
exports.check = function(req, res, next) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    if(quiz) {
      var answer = req.query.answer;
      var result = answer === quiz.answer ? 'Correcta':'Incorrecta';
      res.render('quizzes/result',{
        quiz : quiz,
        answer : answer,
        result : result
      });
    }
    else {
      throw new Error('No existe esa pregunta en la BBDD.');
    }
  }).catch(function(error) {
    next(error);
  });
};
