var models = require('../models');

exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(function(quiz) {
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
                }
            );
        }
    ).catch(function(error){next(error);});
  }else{
  models.Quiz.findAll().then(function(quizzes) {
    res.render('quizzes/index.ejs', {
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
  var result = answer === req.quiz.answer ? 'Correcta':'Incorrecta';
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
  console.log("HHHHHH");
  var quiz = models.Quiz.build({
    question: req.body.question,
    answer: req.body.answer
  });
  console.log("KKKKK");
  quiz.save({fields: ["question", "answer"]})
    .then(function(quiz) {
      res.redirect('/quizzes');
    }).catch(function(error) {
      next(error);
    });
};
