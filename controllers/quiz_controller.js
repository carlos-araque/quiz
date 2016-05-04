var models = require('../models');
var Sequelize = require('sequelize');

exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(function(quiz) {
    if(quiz){
      req.quiz = quiz;
      console.log("HHH");
      next();
    } else{
      throw new Error("No existe quizId=" + quizId);
    }
  }).catch(function(error) {
    next(error);
  });
};

// GET /quizzes
exports.index = function(req, res, next) {
  if(req.query.search){
    var texto = '%' + req.query.search.toString()+'%';
    texto = texto.replace(/ /g, "%"); //replace espacios por %
    models.Quiz.findAll({where: ["question like ?", texto]})
        .then(function(quizzes) {
            res.render('quizzes/index',
                {
                    quizzes: quizzes
                }
            );
        }
    ).catch(function(error){next(error);});
  }else{
  models.Quiz.findAll().then(function(quizzes) {
    res.render('quizzes/index', {
      quizzes : quizzes
    });
  }).catch(function(error){
    next(error);
  });}
};

// GET /quizzes/:id
exports.show = function(req, res, next) {
    var answer = req.query.answer || '';
      res.render('quizzes/show',{
        quiz : req.quiz,
        answer : answer
      });
};

//GET check
exports.check = function(req, res, next) {
  var answer = req.query.answer || "";
  var result = answer.toLowerCase() === req.quiz.answer.toLowerCase() ? 'Correcta':'Incorrecta';
    res.render('quizzes/result',{
        quiz : req.quiz,
        answer : answer,
        result : result
    });
};

//GET new
exports.new = function(req, res, next) {
  res.render('quizzes/new');
};

//POST create
exports.create = function(req, res, next) {
  var quiz = models.Quiz.build({
    question: req.body.question,
    answer: req.body.answer
  });
  quiz.save({fields: ["question", "answer"]})
    .then(function(quiz) {
      req.flash('success', 'Pregunta creada con éxito');
      res.redirect('/quizzes');
    }).catch(Sequelize.ValidationError, function(error) {
      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
        req.flash('error', error.errors[i].value);
      };
      res.render('quizzes/new');
    })
    .catch(function(error) {
      req.flash('error', 'Error al crear pregunta: '+error.message);
      next(error);
    });
};

//GET edit
exports.edit = function(req, res, next){
  res.render('quizzes/edit', {
    quiz: req.quiz
  });
};
//PUT /quizzes/:id
exports.update = function(req, res, next) {
  req.quiz.question = req.body.question;
  req.quiz.answer = req.body.answer;
  console.log(req.quiz);
  req.quiz.save({fields: ["question", "answer"]}).then(function(quiz){
    req.flash('success', 'Pregunta modificada con éxito');
    res.redirect('/quizzes');
  }).catch(Sequelize.ValidationError, function(error) {
    req.flash('error', 'Errores en el formulario:');
    console.log("EEE");
    for(var i in error.errors){
      req.flash('error', error.errors[i].value);
    };
    res.render('quizzes/edit', {
      quiz: req.quiz
    });
  }).catch(function(error) {
    req.flash('error', 'Error al editar el Quiz:'+ error.message);
    next(error);
  });
};
