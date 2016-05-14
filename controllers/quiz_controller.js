var models = require('../models');
var Sequelize = require('sequelize');

exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId, {include: [models.Comment]})
  .then(function(quiz) {
    if(quiz){
      req.quiz = quiz;
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
                });
    }).catch(function(error){next(error);});
  }else if(req.query.tematica){
    var tematica = req.query.tematica;
    models.Quiz.findAll({where : { tematica : tematica}})
    .then(function(quizzes) {
        res.render('quizzes/index',
            {
                quizzes: quizzes
            });
    }).catch(function(error){next(error);});
  }else{
  models.Quiz.findAll().then(function(quizzes) {
    if(req.params.format==="json"){
      res.json({ quizzes});
    }else{
      res.render('quizzes/index',
          {
              quizzes: quizzes
          });}
  }).catch(function(error){
    next(error);
  });}
};

// GET /quizzes/:id
exports.show = function(req, res, next) {
    var answer = req.query.answer || '';
    var quiz = req.quiz;
    if(req.params.format==="json"){
      res.json({ quiz });
    }else{
      res.render('quizzes/show',{
        tematica : quiz.tematica.toUpperCase(),
        quiz : quiz,
        answer : answer
      });}
};

//GET check
exports.check = function(req, res, next) {
  var answer = req.query.answer || "";
  answer = answer.replace("+",/ /g); //replace espacios por %
  var result = answer.toLowerCase() === req.quiz.answer.toLowerCase() ? 'Correcta':'Incorrecta';
    res.render('quizzes/result',{
        quiz : req.quiz,
        answer : answer,
        result : result
    });
};

//GET new
exports.new = function(req, res, next) {
  var quiz = models.Quiz.build({question: "", answer:""});
  res.render('quizzes/new', {
    quiz : quiz
  });
};

//POST create
exports.create = function(req, res, next) {
  var quiz = models.Quiz.build({
    question: req.body.question,
    answer: req.body.answer,
    tematica: req.body.tematica
  });
  quiz.save({fields: ["question", "answer", "tematica"]})
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
  req.quiz.save({fields: ["question", "answer"]}).then(function(quiz){
    req.flash('success', 'Pregunta modificada con éxito');
    res.redirect('/quizzes');
  }).catch(Sequelize.ValidationError, function(error) {
    req.flash('error', 'Errores en el formulario:');
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

//DESTROY /quizzes/:id
exports.destroy = function(req, res, next) {
  req.quiz.destroy().then(function(quiz) {
    req.flash('success', quiz.question+' borrado con éxito');
    res.redirect('/quizzes');
  }).catch(function(error){
    req.flash('error', 'Error al borrar el quiz: '+error.message);
    next(error);
  });
};
