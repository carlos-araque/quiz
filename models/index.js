var path = require('path');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(null, null, null, {
  dialect: 'sequelize',
  storage: 'quiz.sqlite'
});

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

sequelize.sync().then(function(){
  return Quiz.count().then(function(c){
    if (c === 0) {
      return Quiz.create({
          question: 'Capital de Italia',
          answer: 'Roma'
      }).then(function(){
        console.log('Base de datos inicializada con datos');
      });
    }
  });
}).catch(function(error){
  console.log("Error Sincronizando las tablas de la BBDD:", error);
  process.exit(1);
});

exports.Quiz = Quiz;
